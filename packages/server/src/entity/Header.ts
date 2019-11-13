import { Entity, Column, OneToMany, PrimaryColumn, ManyToOne } from 'typeorm'
import { Validator } from './Validator'
import { Era } from './Era'

@Entity()
export class Header {
  @PrimaryColumn()
  id: number

  @Column()
  blockHash: string

  @Column({ type: 'bigint' })
  timestamp: number

  @ManyToOne(type => Validator, validator => validator.blocksProduced)
  validator: Validator

  @ManyToOne(type => Era, era => era.blockHeaders)
  era: Era
}
