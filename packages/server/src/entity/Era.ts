import {
  Entity,
  Column,
  PrimaryColumn,
  JoinTable,
  ManyToMany,
  OneToMany
} from 'typeorm'
import { Header } from './Header'
import { Validator } from './Validator'

@Entity()
export class Era {
  @PrimaryColumn()
  eraIndex: number

  @Column({ nullable: true })
  startTime: string

  @Column({ nullable: true })
  endTime: string

  @Column({ nullable: true })
  rewards: string

  @Column({ nullable: true })
  slashes: string

  @Column({ nullable: true })
  ended: boolean

  @OneToMany(type => Header, header => header.era)
  blockHeaders: Header[]

  @ManyToMany(type => Validator)
  @JoinTable()
  validators: Validator[]
}
