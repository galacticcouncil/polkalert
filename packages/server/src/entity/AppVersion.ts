import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class AppVersion {
  @PrimaryColumn()
  id: number

  @Column()
  version: string
}
