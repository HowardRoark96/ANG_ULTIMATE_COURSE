import { Mail } from './mail.interface';

export interface Folder {
  name: string,
  entityId: string,
  id: string,
  canDelete: boolean,
  canEdit: boolean
}

export interface FolderEntity{
  name: string,
  id: string,
  mails?: Mail[],
  canDelete: boolean,
  canEdit: boolean
}
