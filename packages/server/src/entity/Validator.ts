import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm'
import { Header } from './Header'
import { CommissionData } from './CommissionData'

@Entity()
export class Validator {
  @PrimaryColumn()
  accountId: string

  @OneToMany(type => CommissionData, commissionData => commissionData.validator)
  commissionData: CommissionData[]

  @OneToMany(type => Header, header => header.validator)
  blocksProduced: Header[]

  @Column({ nullable: true })
  blocksProducedCount: number
}
