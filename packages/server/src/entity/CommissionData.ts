import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm'

import { Validator } from './Validator'

@Entity()
export class CommissionData {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  eraIndex: number

  @Column()
  sessionIndex: number

  @Column({ nullable: true })
  controllerId: string

  @Column({ nullable: true })
  bondedSelf: string

  @Column({ nullable: true })
  nominatorData: string

  @Column({ nullable: true })
  commission: string

  @Column({ nullable: true })
  sessionId: string

  @Column({ nullable: true })
  nextSessionId: string

  @Column({ nullable: true })
  sessionIds: string

  @Column({ nullable: true })
  nextSessionIds: string

  @ManyToOne(type => Validator, validator => validator.commissionData)
  validator: Validator
}
