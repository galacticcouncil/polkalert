import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm'

import { Validator } from './Validator'
import { SessionInfo } from './SessionInfo'

@Entity()
export class Slash {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: string

  @Column()
  sessionIndex: number

  @ManyToOne(
    type => SessionInfo,
    sessionInfo => sessionInfo.slashes
  )
  sessionInfo: SessionInfo

  @ManyToOne(
    type => Validator,
    validator => validator.slashes
  )
  validator: Validator
}
