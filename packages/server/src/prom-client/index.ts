import promClient from 'prom-client'
import express from 'express'
import db from '../db'
import settings from '../settings'
import logger from '../logger'
const register = promClient.register;

import { formatDecimal } from '@polkadot/util'

const prefix = `polkalert_`;

//those labels are used for all metrics
type Labels = {
  name: string,
  version: string,
  specVersion: number,
  chain: string,
  validator_id: string
}

const labelNames: string[] = [ 'validator_id', 'name', 'version', 'chain', 'specVersion' ]

const metrics = {
  slashAmount: new promClient.Gauge({
    name: `${prefix}slash_amount`,
    help: 'TODO: description',
    labelNames: labelNames
  }),

  slashCount: new promClient.Gauge({
    name: `${prefix}slash_count`,
    help: 'Number of times validator was slashed.',
    labelNames: labelNames
  }),

  blockProduced: new promClient.Gauge({
    name: `${prefix}block_produced`,
    help: 'Number of block produced.',
    labelNames: labelNames 
  }),

  //validatorCount: new promClient.Counter({
  //  name: `${prefix}validator_count`,
  //  help: `Number of time chosen as validator`,
  //  labelNames: labelNames
  //}),

  //caughtOffline: new promClient.Counter({
  //  name: `${prefix}caught_offline`,
  //  help: 'Number of time validator was caught offline.',
  //  labelNames: labelNames
  //}),

  ////offline count
  //offlineCount: new promClient.Counter({
  //  name: `${prefix}offline`,
  //  help: 'Number of time validator was offline',
  //  labelNames: labelNames 
  //}),

  //offlineTime: new promClient.Counter({
  //  name: `${prefix}offline_time`,
  //  help: 'Total time[sec] when validator was offline.',
  //  labelNames: labelNames 
  //}),
  
  //equivocationCount: new promClient.Counter({
  //  name: `${prefix}equivocations`,
  //  help: 'Equivocation count.',
  //  labelNames: labelNames
  //}),

  //blockPropagationTime: new promClient.Gauge({
  //  name: `${prefix}block_propagation_time`,
  //  help: `Block propagation time`,
  //  labelNames: labelNames
  //}),

  //currentStakeSelf: new promClient.Gauge({
  //  name: `${prefix}stake_self`,
  //  help: 'Current stake by validator.',
  //  labelNames: labelNames
  //}),
  
  // currentStakeFromNominators: new promClient.Gauge({
  //   name: `${prefix}stake_nominators`,
  //   help: 'Sum of stakes from validator nominators',
  //   labelNames: labelNames 
  // }),
  
  commission: new promClient.Gauge({
    name: `${prefix}commission`,
    help: `Current validator's commission`,
    labelNames: labelNames 
  }),

  //peersCount: new promClient.Gauge({
  //  name: `${prefix}peers`,
  //  help: `Peers count for validtor's node`,
  //  labelNames: labelNames 
  //}),
}

export const prom = {
  initMetricsRoute(app: express.Application) { 
    app.get('/metrics', async(_, res) => {
      res.set('Content-Type', register.contentType);

      //NOTE: this is "optional". This is used to remove "old" metrics after validator id change in settings.
      register.resetMetrics()

      const validatorId = settings.get().validatorId
      if (!validatorId) {
        logger.error('prom you need to set validator to monitor', 'prom-client validator is not set')

        return res.status(400).send('You need to set validator to monitor in settings').end();
      }

      const [nodeInfo, validator] = await Promise.all([
        db.getNodeInfo(),
        db.getValidatorInfo(validatorId)
      ]);

      const commissionData = validator.commissionData[0];

      const labels: Labels = {
        name: nodeInfo.specName,
        version: nodeInfo.systemVersion,
        specVersion: nodeInfo.specVersion,
        chain: nodeInfo.chain,
        validator_id: validatorId
      }

      let slashAmountSum:number = 0; 
      for (let i = 0, l = validator.slashes.length; i < l; i++) {
        slashAmountSum += Number(validator.slashes[i].amount);
      } 

      metrics.slashAmount.set(labels, slashAmountSum)
      metrics.slashCount.set(labels, validator.slashes.length)
      metrics.blockProduced.set(labels, validator.blocksProducedCount)
      metrics.commission.set(labels, parseFloat(commissionData.commission.replace(/%/, '')))

      res.end(register.metrics());
    });
  }
}
