import styled from 'styled-components'
import { transparentize } from 'polished'

import { Card, Divider, Dropdown } from 'ui'
import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled(Card)<{
  current: boolean
}>`
  ${p => !p.current && `--color: ${Colors.Gray[100]};`};

  padding: 16px;
  box-shadow: 0px 2px 16px ${transparentize(0.8, Colors.Black)};
  opacity: ${p => !p.current && '0.5'};

  @media ${device.sm} {
    padding: 24px;
  }

  @media ${device.lg} {
    padding: 32px;
  }

  &:not(:last-of-type) {
    margin-bottom: 16px;

    @media ${device.lg} {
      margin-bottom: 32px;
    }
  }
`

export const FirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media ${device.lg} {
    flex-direction: row;
    align-items: center;
  }
`

export const Address = styled.div<{
  big?: boolean
  nominator?: boolean
}>`
  width: ${p => p.nominator && '160px'};
  margin-top: ${p => p.nominator && '12px'};
  margin-right: ${p => (p.big ? '72px' : '24px')};
  position: relative;
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 16px;

    @media ${device.lg} {
      margin-bottom: 0;
    }
  }

  > span {
    margin-left: 8px;

    @media ${device.lg} {
      margin-left: ${p => (p.big ? '16px' : '8px')};
    }

    div {
      margin-bottom: 4px;
      font-weight: ${p => p.nominator && '500'};
      line-height: 15px;
    }

    strong {
      color: var(--color, ${Colors.White});
      font-size: 14px;
      line-height: 17px;
    }
  }
`

export const OnlineState = styled.div`
  position: absolute;
  top: -6px;
  left: -8px;
  z-index: 100;
  display: flex;
  pointer-events: none;
`

export const OnlineStateIcon = styled.div<{
  wasOnline?: boolean
}>`
  width: 24px;
  height: 24px;
  background: var(
    --color,
    ${p => (p.wasOnline ? Colors.Success : Colors.Error)}
  );
  box-shadow: 0 0 5px ${transparentize(0.5, Colors.Black)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  pointer-events: auto;

  &:hover + span {
    opacity: 1;
  }

  img,
  svg {
    width: 12px;
    height: 12px;
    position: relative;
    z-index: 100;
  }

  path {
    fill: ${Colors.White};
  }
`

export const OnlineStateText = styled.span<{
  wasOnline?: boolean
}>`
  padding: 0 12px 0 28px;
  background: var(
    --color,
    ${p => (p.wasOnline ? Colors.Success : Colors.Error)}
  );
  border-radius: 50px;
  color: ${Colors.White};
  line-height: 24px;
  white-space: nowrap;
  transform: translateX(-24px);
  opacity: 0;
  transition: opacity 0.2s;
  align-items: center;
`

export const SecondLine = styled.div`
  padding-top: 24px;

  div {
    padding-top: 8px;
    white-space: nowrap;

    &.flex {
      display: flex;
      align-items: center;
    }

    span {
      margin-left: 5px;
      color: var(--color, ${Colors.Primary});
      font-size: 18px;
    }

    button:hover {
      color: var(--color, ${Colors.Primary});
      border: 2px solid var(--color, ${Colors.Primary});
    }
  }
`

export const NominatorsDropdownButton = styled(Divider)<{
  isOpen: boolean
}>`
  margin: 24px 0 12px;

  @media ${device.lg} {
    margin: 48px 0 12px;
  }

  button {
    color: inherit;
    display: flex;
    align-items: center;

    img,
    svg {
      width: 10px;
      height: 10px;
      margin-right: 6px;
      transform: rotate(${p => (p.isOpen ? 0 : -90)}deg);
      transition: transform 0.15s;
    }

    svg path {
      fill: currentColor;
    }
  }
`

export const NominatorsDropdownList = styled(Dropdown)`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const Block = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;

  div {
    display: flex;
  }

  span {
    margin-left: 16px;
  }
`
