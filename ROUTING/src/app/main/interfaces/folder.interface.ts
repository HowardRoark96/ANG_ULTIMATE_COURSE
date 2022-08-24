import { Mail } from './mail.interface';

export interface Folder {
  name: string,
  id: string,
  mails?: Mail[],
  canDelete: boolean,
  canEdit: boolean
}
