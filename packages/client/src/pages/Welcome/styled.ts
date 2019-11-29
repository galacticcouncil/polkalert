import styled from 'styled-components'
import { transparentize } from 'polished'

import { Input } from 'ui'
import { Colors } from 'styles/variables'
import { device } from 'styles/media'

export const Wrapper = styled.div`
  min-height: 100%;
  margin: 0 -16px;
  padding: 32px 0;
  background-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${device.lg} {
    height: calc(100% + 112px);
    margin: -56px;
  }
`

export const Inner = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-column-gap: 48px;
  grid-row-gap: 56px;
  align-items: center;

  @media ${device.md} {
    grid-template-columns: 1fr 1fr;
  }

  > div:last-of-type {
    justify-self: center;
  }
`

export const Info = styled.div`
  h1, h2 {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 12px;
    color: ${Colors.White};
    font-size: 40px;
    line-height: 56px;

    @media ${device.md} {
      margin-bottom: 24px;
      font-size: 64px;
      line-height: 84px;
    }


    svg,
    img {
      width: 152px;
      height: auto;
      margin: 0 0 -16px 12px;

      @media ${device.md} {
        width: 256px;
        margin: 0 0 -24px 20px;

      }
    }

    path {
      fill: ${Colors.Primary};
    }
  }

  h2 {
    margin-bottom 56px;
    color: ${transparentize(0.1, Colors.Gray[100])};
    font-size: 16px;
    font-weight: 500;

    @media ${device.md} {
      margin-bottom 160px;

    }

    strong {
      position: relative;
      
      &:after {
        content: ' ';
        height: 1px;
        background: currentColor;
        position: absolute;
        right: 0;
        bottom: -1px;
        left: 0;
      }
    }
  }

  > div {
    max-width: 400px;
    padding-bottom: 18px;
    color: ${Colors.Gray[100]};
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;

    strong {
      color: ${Colors.Primary};
    }

    small {
      padding-top: 24px;
      color: ${transparentize(0.1, Colors.Gray[100])};
      line-height: 20px;
      display: block;
    }
  }
`

export const FormWrapper = styled.div`
  max-width: 100%;
  width: 300px;
`

export const Form = styled.div`
  padding-bottom: 40px;
`

export const FormInput = styled(Input)`
  width: 100%;
  margin: 16px 0 0;
`

export const ModalTitle = styled.div`
  margin-top: 8px;
  margin-bottom: 32px;
  color: ${Colors.Gray[100]};
  font-size: 32px;
  font-weight: 700;
`

export const ModalText = styled.div`
  margin-bottom: 48px;
  color: ${Colors.Gray[100]};
  font-weight: 700;

  strong {
    color: ${Colors.Primary};
  }
`

export const ModalActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;

  button {
    padding: 8px;
  }
`
