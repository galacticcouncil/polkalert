import React, { useState } from 'react'
import SVG from 'react-inlinesvg'
import CSS from 'csstype'

import { SlashInterface } from 'types'
import { Identicon } from 'ui'
import { ValidatorModal } from 'components'
import { formatAddress } from 'utils'
import { useMediaQuery, useBooleanState } from 'hooks'

import { device } from 'styles/media'
import * as S from './styled'

type Nominator = {
  accountId: string
  stake: string
}

type Props = {
  hideInfoButton?: boolean
  stashId?: string
  controllerId?: string
  bondedTotal?: string
  bondedSelf?: string
  bondedFromNominators?: string
  commission?: string
  blocksProducedCount?: number
  slashes?: SlashInterface[]
  recentlyOnline?: boolean
  sessionIds?: string[]
  nextSessionIds?: string[]
  nominators?: Nominator[]
  current?: boolean
  className?: string
  style?: CSS.Properties
}

const ValidatorCard = ({
  hideInfoButton,
  stashId,
  controllerId,
  bondedTotal = '0.000',
  bondedSelf = '0.000',
  bondedFromNominators = '0.000',
  commission,
  blocksProducedCount,
  slashes,
  sessionIds,
  nextSessionIds,
  recentlyOnline,
  nominators,
  current = true,
  className = '',
  style
}: Props) => {
  const [sessionIdsVisible, setSessionIdsVisible] = useState<boolean>(false)
  const [nextSessionIdsVisible, setNextSessionIdsVisible] = useState<boolean>(
    false
  )
  const [nominatorsVisible, setNominatorsVisible] = useState<boolean>(false)
  const [infoModalVisible, showInfoModal, hideInfoModal] = useBooleanState()
  const isDesktop = useMediaQuery(device.lg)

  return (
    <S.Wrapper fluid current={current} className={className} style={style}>
      {!hideInfoButton && (
        <S.DetailsButton
          theme="outlineMini"
          text="Info"
          onClick={showInfoModal}
          style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}
        />
      )}
      <S.Addresses>
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
      </S.Addresses>
      <S.Info>
        <S.InfoColumn>
          <div>
            Bonded - total:<span>{bondedTotal}</span>
          </div>
          <div>
            Bonded - self:<span>{bondedSelf}</span>
          </div>
          <div>
            Bonded - nominators:<span>{bondedFromNominators}</span>
          </div>
        </S.InfoColumn>
        <S.InfoColumn>
          {commission && (
            <div>
              Commission:<span>{commission}</span>
            </div>
          )}
          <div>
            Blocks produced:<span>{blocksProducedCount || 0}</span>
          </div>
          <div>
            Slashes:<span>{slashes?.length || 0}</span>
          </div>
        </S.InfoColumn>
      </S.Info>
      {!!sessionIds?.length && (
        <>
          <S.DropdownButton isOpen={sessionIdsVisible}>
            <button onClick={() => setSessionIdsVisible(!sessionIdsVisible)}>
              <SVG src="/icons/arrow-down.svg">
                <img src="/icons/arrow-down.svg" alt="toggle" />
              </SVG>
              Session IDs ({sessionIds.length})
            </button>
          </S.DropdownButton>
          <S.DropdownList isOpen={sessionIdsVisible}>
            {sessionIds.map((item, idx) => (
              <S.Address
                nominator
                key={`validator-${stashId}-sessionId-${idx}`}
              >
                <Identicon value={item} size={40} />
                <span>
                  <div>{formatAddress(item)}</div>
                </span>
              </S.Address>
            ))}
          </S.DropdownList>
        </>
      )}
      {!!nextSessionIds?.length && (
        <>
          <S.DropdownButton isOpen={nextSessionIdsVisible}>
            <button
              onClick={() => setNextSessionIdsVisible(!nextSessionIdsVisible)}
            >
              <SVG src="/icons/arrow-down.svg">
                <img src="/icons/arrow-down.svg" alt="toggle" />
              </SVG>
              Next session IDs ({nextSessionIds.length})
            </button>
          </S.DropdownButton>
          <S.DropdownList isOpen={nextSessionIdsVisible}>
            {nextSessionIds.map((item, idx) => (
              <S.Address
                nominator
                key={`validator-${stashId}-nextSessionId-${idx}`}
              >
                <Identicon value={item} size={40} />
                <span>
                  <div>{formatAddress(item)}</div>
                </span>
              </S.Address>
            ))}
          </S.DropdownList>
        </>
      )}
      {!!nominators?.length && (
        <>
          <S.DropdownButton isOpen={nominatorsVisible}>
            <button onClick={() => setNominatorsVisible(!nominatorsVisible)}>
              <SVG src="/icons/arrow-down.svg">
                <img src="/icons/arrow-down.svg" alt="toggle" />
              </SVG>
              Nominators ({nominators.length})
            </button>
          </S.DropdownButton>
          <S.DropdownList isOpen={nominatorsVisible}>
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
          </S.DropdownList>
        </>
      )}

      {!hideInfoButton && stashId && infoModalVisible && (
        <ValidatorModal onClose={hideInfoModal} accountId={stashId} />
      )}
    </S.Wrapper>
  )
}

export default ValidatorCard
