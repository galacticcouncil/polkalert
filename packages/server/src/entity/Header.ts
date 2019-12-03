import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from 'typeorm'
import { Validator } from './Validator'
import { SessionInfo } from './SessionInfo'

@Entity()
export class Header {
  @PrimaryColumn()
  id: number

  @Column()
  blockHash: string

  @OneToOne(
    type => SessionInfo,
    sessionInfo => sessionInfo.header
  )
  @JoinColumn()
  sessionInfo: SessionInfo

  @Column({ type: 'bigint' })
  timestamp: number

  @ManyToOne(
    type => Validator,
    validator => validator.blocksProduced
  )
  validator: Validator
}
