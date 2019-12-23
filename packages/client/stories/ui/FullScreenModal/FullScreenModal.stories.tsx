import React from 'react'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs'

import { FullScreenModal } from 'ui'
import { useBooleanState } from 'hooks'
import { NOOP } from 'utils'

storiesOf('UI|FullScreenModal', module)
  .add('permanent', () => {
    const textKnob = text(
      'Text',
      'Cupcake ipsum dolor sit amet bonbon pudding sugar plum jujubes. Biscuit sweet fruitcake tart cupcake cotton candy jelly beans gummi bears tart. Cheesecake gummies sweet roll candy lollipop jelly. Chocolate bar powder muffin liquorice croissant halvah wafer sugar plum. Jujubes brownie lollipop soufflé. Sweet ice cream cookie jelly beans sweet roll fruitcake cupcake sweet. Chocolate bar gingerbread dessert. Cheesecake pudding danish halvah jujubes toffee. Cheesecake cotton candy jujubes candy canes pastry toffee marshmallow. Danish toffee gingerbread sweet roll sweet roll. Icing macaroon oat cake. Sugar plum donut sesame snaps halvah muffin wafer candy jelly. Bonbon danish donut marshmallow cheesecake marzipan biscuit powder.',
      'props'
    )

    return <FullScreenModal onClose={NOOP}>{textKnob}</FullScreenModal>
  })
  .add('with animation', () => {
    const [modalVisible, showModal, hideModal] = useBooleanState()

    const textKnob = text(
      'Text',
      'Cupcake ipsum dolor sit amet bonbon pudding sugar plum jujubes. Biscuit sweet fruitcake tart cupcake cotton candy jelly beans gummi bears tart. Cheesecake gummies sweet roll candy lollipop jelly. Chocolate bar powder muffin liquorice croissant halvah wafer sugar plum. Jujubes brownie lollipop soufflé. Sweet ice cream cookie jelly beans sweet roll fruitcake cupcake sweet. Chocolate bar gingerbread dessert. Cheesecake pudding danish halvah jujubes toffee. Cheesecake cotton candy jujubes candy canes pastry toffee marshmallow. Danish toffee gingerbread sweet roll sweet roll. Icing macaroon oat cake. Sugar plum donut sesame snaps halvah muffin wafer candy jelly. Bonbon danish donut marshmallow cheesecake marzipan biscuit powder.',
      'props'
    )

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <button
          onClick={showModal}
          style={{ color: 'white', fontSize: '24px' }}
        >
          Open Modal
        </button>
        {modalVisible && (
          <FullScreenModal onClose={hideModal}>{textKnob}</FullScreenModal>
        )}
      </div>
    )
  })
