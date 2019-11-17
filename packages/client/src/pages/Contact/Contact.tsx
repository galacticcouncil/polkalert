import React, { useState } from 'react'
import SVG from 'react-inlinesvg'

import { PageTitle, Input, Textarea, Button, Modal } from 'ui'
import { encodeURI } from 'utils'
import { useBooleanState } from 'hooks'

import * as S from './styled'

const Contact = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [errorModalVisible, showErrorModal, hideErrorModal] = useBooleanState()
  const [
    successModalVisible,
    showSuccessModal,
    hideSuccessModal
  ] = useBooleanState()

  const validateForm = () => {
    // Does name contain any characters after removing whitespace?
    const nameProvided = !!name.replace(/\s/g, '')
    // Does email contain "@" and "."? Also is it without whitespace?
    const emailProvided = /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/.test(
      email
    )
    // Does message contain any characters after removing whitespace?
    const messageProvided = !!message.replace(/\s/g, '')

    return nameProvided && emailProvided && messageProvided
  }

  const handleFormSubmit = e => {
    const formIsValid = validateForm()

    if (formIsValid) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeURI({
          'form-name': 'contact',
          name,
          email,
          message
        })
      }).then(showSuccessModal)
    } else {
      showErrorModal()
    }

    e.preventDefault()
  }

  return (
    <S.Wrapper>
      <S.Form onSubmit={handleFormSubmit}>
        <PageTitle>Contact Us</PageTitle>
        <Input
          fluid
          required
          name="name"
          label="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          fluid
          required
          name="email"
          label="Your email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Textarea
          fluid
          required
          name="message"
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button fluid type="submit" text="Submit" />
      </S.Form>
      <S.Logo>
        Made by
        <a
          href="https://zeeprime.capital/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SVG src="/images/zeeprime.svg">
            <img src="/images/zeeprime.svg" alt="ZeePrime" />
          </SVG>
        </a>
      </S.Logo>

      {errorModalVisible && (
        <Modal onClose={hideErrorModal}>
          <S.ErrorMsg>
            Please make sure that all fields are filled out and the email
            address is in a correct format.
          </S.ErrorMsg>
          <Button
            condensed
            fluid
            theme="outline"
            text="Okay"
            onClick={hideErrorModal}
            style={{ marginTop: '24px' }}
          />
        </Modal>
      )}
      {successModalVisible && (
        <Modal onClose={hideSuccessModal}>
          <S.SuccessMsg>
            Thank you for your message, we&apos;ll get in touch with you soon.
          </S.SuccessMsg>
          <Button
            condensed
            fluid
            text="Close"
            onClick={hideSuccessModal}
            style={{ marginTop: '24px' }}
          />
        </Modal>
      )}
    </S.Wrapper>
  )
}

export default Contact
