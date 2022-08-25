import { Folder, FolderEntity } from '../../main/interfaces/folder.interface';

export interface User {
  login: string,
  password: string,
  foldersEntities?: FolderEntity[],
  folders?: Folder[],
  id?: string
}
