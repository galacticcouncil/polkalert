import React from 'react'
import SVG from 'react-inlinesvg'
import CSS from 'csstype'

import { BlockInterface, Slash } from 'types'
import { Identicon, Button, Modal } from 'ui'
import { formatAddress } from 'utils'
import { useMediaQuery, useBooleanState } from 'hooks'

import { device } from 'styles/media'
import * as S from './styled'

type Nominator = {
  accountId: string
  stake: string
}

type Props = {
  stashId?: string
  controllerId?: string
  sessionId?: string
  bondedTotal?: string
  bondedSelf?: string
  bondedFromNominators?: string
  commission?: string
  blocksProduced?: BlockInterface[]
  slashes?: Slash[]
  recentlyOnline?: boolean
  nominators?: Nominator[]
  current?: boolean
  className?: string
  style?: CSS.Properties
}

const ValidatorCard = ({
  stashId,
  controllerId,
  sessionId,
  bondedTotal = '0.000',
  bondedSelf = '0.000',
  bondedFromNominators = '0.000',
  commission,
  blocksProduced,
  slashes,
  recentlyOnline,
  nominators,
  current = true,
  className = '',
  style
}: Props) => {
  const [nominatorsVisible, showNominators, hideNominators] = useBooleanState()
  const [
    blocksModalVisible,
    showBlocksModal,
    hideBlocksModal
  ] = useBooleanState()
  const [
    slashesModalVisible,
    showSlashesModal,
    hideSlashesModal
  ] = useBooleanState()
  const isDesktop = useMediaQuery(device.lg)

  const toggleNominatorsVisible = () => {
    nominatorsVisible ? hideNominators() : showNominators()
  }

  return (
    <S.Wrapper fluid current={current} className={className} style={style}>
      <S.FirstLine>
        {stashId && (
          <S.Address big>
            <S.OnlineState>
              <S.OnlineStateIcon wasOnline={recentlyOnline}>
                <SVG
                  src={recentlyOnline ? '/icons/check.svg' : '/icons/close.svg'}
                >
                  <img
                    src={
                      recentlyOnline ? '/icons/check.svg' : '/icons/close.svg'
                    }
                    alt={recentlyOnline ? 'Online' : 'Offline'}
                  />
                </SVG>
              </S.OnlineStateIcon>
              <S.OnlineStateText wasOnline={recentlyOnline}>
                Reported {recentlyOnline ? 'online' : 'offline'} in the current
                session
              </S.OnlineStateText>
            </S.OnlineState>
            <Identicon
              value={stashId}
              size={isDesktop ? 56 : 40}
              current={current}
            />
            <span>
              <div>Validator (Stash)</div>
              <strong>{formatAddress(stashId)}</strong>
            </span>
          </S.Address>
        )}
        {controllerId && (
          <S.Address>
            <Identicon value={controllerId} size={40} current={current} />
            <span>
              <div>Controller</div>
              <strong>{formatAddress(controllerId)}</strong>
            </span>
          </S.Address>
        )}
        {sessionId && (
          <S.Address>
            <Identicon value={sessionId} size={40} current={current} />
            <span>
              <div>Session</div>
              <strong>{formatAddress(sessionId)}</strong>
            </span>
          </S.Address>
        )}
      </S.FirstLine>
      <S.SecondLine>
        <div>
          Bonded - total:<span>{bondedTotal}</span>
        </div>
        <div>
          Bonded - self:<span>{bondedSelf}</span>
        </div>
        <div>
          Bonded - from nominators:<span>{bondedFromNominators}</span>
        </div>
        {commission && (
          <div className="flex">
            Commission:<span>{commission}</span>
          </div>
        )}
        <div>
          Blocks produced in the last 24h:
          <span>{blocksProduced?.length || 0}</span>
          {!!blocksProduced?.length && (
            <Button
              theme="outlineMini"
              text="Show"
              onClick={showBlocksModal}
              style={{ marginLeft: '16px' }}
            />
          )}
        </div>
        <div>
          Slashes:<span>{slashes?.length || 0}</span>
          {!!slashes?.length && (
            <Button
              theme="outlineMini"
              text="Show"
              onClick={showSlashesModal}
              style={{ marginLeft: '16px' }}
            />
          )}
        </div>
      </S.SecondLine>
      {nominators && !!nominators.length && (
        <>
          <S.NominatorsDropdownButton isOpen={nominatorsVisible}>
            <button onClick={toggleNominatorsVisible}>
              <SVG src="/icons/arrow-down.svg">
                <img src="/icons/arrow-down.svg" alt="toggle" />
              </SVG>
              Nominators ({nominators.length})
            </button>
          </S.NominatorsDropdownButton>
          <S.NominatorsDropdownList isOpen={nominatorsVisible}>
            {nominators.map(
              (item, idx) =>
                item.accountId &&
                item.stake && (
                  <S.Address
                    nominator
                    key={`validator-${stashId}-nominator-${idx}`}
                  >
                    <Identicon value={item.accountId} size={40} />
                    <span>
                      <div>{formatAddress(item.accountId)}</div>
                      <div>{item.stake}</div>
                    </span>
                  </S.Address>
                )
            )}
          </S.NominatorsDropdownList>
        </>
      )}

      {!!blocksProduced?.length && blocksModalVisible && (
        <Modal onClose={hideBlocksModal}>
          Numbers of produced blocks:
          {blocksProduced.map((item, idx) => (
            <S.Block key={`${stashId}-block-${idx}`}>{item.id}</S.Block>
          ))}
        </Modal>
      )}
      {!!slashes?.length && slashesModalVisible && (
        <Modal onClose={hideSlashesModal}>
          {slashes.map((item, idx) => (
            <S.Block key={`${stashId}-slash-${idx}`}>{item}</S.Block>
          ))}
        </Modal>
      )}
    </S.Wrapper>
  )
}

export default ValidatorCard
