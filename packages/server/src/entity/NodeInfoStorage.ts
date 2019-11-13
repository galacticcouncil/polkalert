import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class NodeInfoStorage {
  @PrimaryColumn()
  id: number

  @Column()
  data: string
}
