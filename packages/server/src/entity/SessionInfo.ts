import { Entity, Column, PrimaryColumn, OneToOne, OneToMany } from 'typeorm'
import { Header } from './Header'
import { Slash } from './Slash'

@Entity()
export class SessionInfo {
  @PrimaryColumn()
  id: number

  @Column()
  eraIndex: number

  @Column()
  offences: string

  @Column()
  rewards: string

  @OneToMany(
    type => Slash,
    slash => slash.sessionInfo
  )
  slashes: Slash[]

  @OneToOne(
    type => Header,
    header => header.sessionInfo
  )
  header: Header
}
