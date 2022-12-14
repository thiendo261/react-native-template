/* eslint-disable @typescript-eslint/no-explicit-any */
import { File } from '@core/interfaces';
import { Platform } from 'react-native';

type FormDataObject = Record<
  string,
  string | number | boolean | Record<string, any> | File | File[] | any[]
>;

const FILE_PREFIX = 'file://';
const FILE_KEYS: (keyof File)[] = ['uri', 'name', 'type'];

//#region form data helper
const isFile = (param: any): param is File =>
  typeof param === 'object' && FILE_KEYS.every(fileKey => fileKey in param);

const platformFile = (file: File): File => ({
  ...file,
  uri: Platform.select({ android: file.uri, ios: file.uri.replace(FILE_PREFIX, '') }) || '',
});

const append = (formData: FormData, key: string, value: any) =>
  formData.append(key, isFile(value) ? platformFile(value) : value);
//#endregion

export const createFormData = (data: FormDataObject): FormData => {
  const formData = new FormData();
  const arrayData = Object.entries(data);
  if (arrayData.isEmpty) return formData;

  for (const [key, value] of arrayData) {
    if (Array.isArray(value)) {
      const formDataKey = key.endsWith('[]') ? key : `${key}[]`;
      value.forEach(val => append(formData, formDataKey, val));
    } else {
      append(formData, key, value);
    }
  }

  return formData;
};
