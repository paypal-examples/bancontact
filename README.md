# Paying with Bancontact or Paypal on the web

<p>
<img src="https://www.paypalobjects.com/images/checkout/latinum/Altpay_logo_bancontact.svg" alt="Bancontact Logo">
<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width="90px" alt="Paypal Logo">
</p>

This integration uses the JavaScript SDK to accept Bancontact payments


See a [hosted version](https://bancontact-js-sdk.herokuapp.com/) of the sample

### How to run locally

Copy the .env.example file into a file named .env

```
cp .env.example .env
```

and configuring your .env config file with your Paypal ClientId and ClientSecret

1. Clone the repo  `git clone git@github.com:paypal-examples/bancontact-payment.git`
2. Run `npm install`
3. Run `npm run dev`
4. Navigate to `http://localhost:8080/`