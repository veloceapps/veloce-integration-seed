import { exec as nodeExec } from 'child_process';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { Metadata } from '../types/common.types';

export const toBase64 = (data: string): string => {
  return Buffer.from(data, 'utf8').toString('base64');
};

export const readFileSafe = async (dir: string): Promise<string> => {
  try {
    const raw = await fs.readFile(dir);
    return raw.toString();
  } catch (e) {
    return '';
  }
};

export const writeFileSafe = async (dir: string, filename: string, data: any): Promise<void> => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  await fs.writeFile(`${dir}/${filename}`, data);
};

export const parseMetadata = (content: string, dir: string): Partial<Metadata> => {
  try {
    return JSON.parse(content ?? '{}');
  } catch (e) {
    throw `Error while parsing JSON in ${dir}`;
  }
};

export const getDirectoryNames = async (dir: string): Promise<string[]> => {
  if (!existsSync(dir)) {
    return [];
  }

  const result = await fs.readdir(dir, { withFileTypes: true });
  return result.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

export const getFileNames = async (dir: string): Promise<string[]> => {
  if (!existsSync(dir)) {
    return [];
  }

  const result = await fs.readdir(dir, { withFileTypes: true });
  return result.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
};

export const exec = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    nodeExec(cmd, { maxBuffer: 1024 * 5000 }, (error, result) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(result);
      }
    });
  });
};
