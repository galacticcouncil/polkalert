import WebHooks from 'node-webhooks';

var webHooks = new WebHooks({
//FIXME to @Jakub- no idea how to use our persistence here
    db: './webHooksDB.json'
})

async function setWebhook(_, { url }) {
  webHooks.add('webhooks', url).then(function(){

  }).catch(function(err){
      console.log(err)
  })
}

async function sendWebhookEvent( data ) {
  webHooks.trigger('webhooks', data)
}

//To send notification to all subscribers,
//use function
//sendWebhookEvent( {...} )

export default {
  setWebhook,
  sendWebhookEvent
}