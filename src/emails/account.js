const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ericckm@outlook.com.br',
        subject: 'Obrigado por se juntar a nós!',
        text: `Seja bem vindo ao nosso aplicativo, ${name}. Deixe-nos saber como esta indo.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ericckm@outlook.com.br',
        subject: 'Lamentamos por te ver partir.',
        text: `Adeus, ${name}. Espero que retorne para à nossa plataforma logo!.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}