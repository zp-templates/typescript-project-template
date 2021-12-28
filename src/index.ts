/* eslint-disable no-process-env */
import * as fs from 'fs';
import path from 'path';

import copy from 'recursive-copy';
import merge from 'deepmerge-json';
import { prompt } from 'enquirer';
import { replaceInFile } from 'replace-in-file';

type ModuleConfig = {
  replacements: { message: string; substitution: string }[];
  fileSpecificSubstitutions: {
    filePath: string;
    message: string;
    template: object;
  }[];
};

async function generator() {
  const { value: projectType } = await prompt<{ value: string }>([
    {
      type: 'select',
      name: 'value',
      message: 'What Project Type?',
      choices: ['core', 'telegram-bot']
    }
  ]);

  const outputDir = process.env?.environment === 'dev' ? './output' : '.';
  await copy('./templates/core', outputDir, {
    overwrite: true,
    dot: true
  });

  if (projectType !== 'core') {
    const mergableFiles = new Map<string, string[]>([['.json', []]]);

    await copy(`./templates/${projectType}`, outputDir, {
      overwrite: true,
      dot: true,
      filter: (filePath) => {
        const fileExtension = path.extname(filePath);
        if (mergableFiles.has(fileExtension)) {
          if (fs.existsSync(`${outputDir}/${filePath}`)) {
            mergableFiles.get(fileExtension)?.push(filePath);
            return false;
          }
        }
        return true;
      }
    });

    mergableFiles.forEach((files, fileExtension) => {
      files.forEach((filePath) => {
        if (fileExtension !== '.json') {
          return;
        }
        const coreJson = JSON.parse(
          fs.readFileSync(`templates/core/${filePath}`).toString()
        );
        const extraJson = JSON.parse(
          fs.readFileSync(`templates/${projectType}/${filePath}`).toString()
        );
        fs.writeFileSync(
          `${outputDir}/${filePath}`,
          JSON.stringify(merge(coreJson, extraJson), null, 2)
        );
      });
    });

    const coreConfig: ModuleConfig = JSON.parse(
      fs.readFileSync(`templates/core.json`).toString()
    );

    const moduleConfig: ModuleConfig = JSON.parse(
      fs.readFileSync(`templates/${projectType}.json`).toString()
    );

    const replacements = coreConfig.replacements;
    replacements.push(...moduleConfig.replacements);

    for (const replacement of replacements) {
      const { value } = await prompt<{ value: string }>({
        type: 'input',
        name: 'value',
        message: replacement.message
      });
      await replaceInFile({
        files: [`${outputDir}/**/*`],
        from: new RegExp(replacement.substitution, 'g'),
        to: value
      });
    }

    const fileSubstitutions = coreConfig.fileSpecificSubstitutions;
    fileSubstitutions.push(...moduleConfig.fileSpecificSubstitutions);

    for (const { filePath, message, template } of fileSubstitutions) {
      const promptValues = await prompt<{ values: { result: string } }>([
        {
          type: 'snippet',
          name: 'values',
          message,
          required: true,
          template: JSON.stringify(template, null, 2)
        }
      ]);

      const outputPackageJson: ModuleConfig = JSON.parse(
        fs.readFileSync(`${outputDir}/${filePath}`).toString()
      );

      const newJson = JSON.parse(promptValues.values.result);

      const combined = merge(outputPackageJson, newJson);

      fs.writeFileSync(
        `${outputDir}/${filePath}`,
        JSON.stringify(combined, null, 2)
      );
    }
  }
}

generator();
