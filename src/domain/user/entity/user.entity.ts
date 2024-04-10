import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: string;

  @Column()
  password: string;

  constructor(accountId: string, password: string) {
    this.accountId = accountId;
    this.password = password;
  }

  updateUserAccountId(accountId: string) {
    this.accountId = accountId;
  }
}
