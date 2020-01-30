import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column({ type: 'bigint' })
  timestamp: number

  @Column()
  title: string

  @Column()
  type: string
}
