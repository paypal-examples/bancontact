/* eslint-disable consistent-return, new-cap, no-alert, no-console */

var order = {
  purchase_units: [
    {
      amount: {
        currency_code: 'EUR',
        value: '49.11',
      },
    },
  ]
}

/* paypal */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.PAYPAL,
  })
  .render('#paypal-mark')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      label: "pay",
      color: "silver",
    },
    createOrder(data, actions) {
      return actions.order.create(order)
    },
    onApprove(data, actions) {
      return actions.order.capture().then(function(details) {
        alert(`Transaction completed by ${details.payer.name.given_name}!`)
      })
    },
  })
  .render('#paypal-btn')

/* bancontact */
paypal
  .Marks({
    fundingSource: paypal.FUNDING.BANCONTACT,
  })
  .render('#bancontact-mark')

paypal
  .PaymentFields({
    fundingSource: paypal.FUNDING.BANCONTACT,
    // style object is optional
    style: {
      // customize field attributes (optional)
      variables: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSizeBase: "0.9375rem",
        fontSizeM: "0.93rem",
        textColor: "#2c2e2f",
        colorTextPlaceholder: "#2c2e2f",
        colorBackground: "#fff",
        colorDanger: "#d20000",
        borderRadius: "0.2rem",
        borderColor: "#dfe1e5",
        borderWidth: "1px",
        borderFocusColor: "black",
        spacingUnit: "10px",
      },
      // set custom rules to apply to fields classes (optional)
      rules: {
        ".Input": {},
        ".Input:hover": {},
        ".Input:focus": {
          color: 'blue',
          boxShadow: '0px 2px 4px rgb(0 0 0 / 50%), 0px 1px 6px rgb(0 0 0 / 25%)',
        },
        ".Input:active": {},
        ".Input--invalid": {},
        ".Label": {},
      },
    },
    fields: {
      name: {
        value: ''
      },
    },
  })
  .render('#bancontact-container')

paypal
  .Buttons({
    fundingSource: paypal.FUNDING.BANCONTACT,
    style: {
      label: 'pay',
    },
    createOrder(data, actions) {
      return actions.order.create(order)
    },
    onApprove(data, actions) {
      fetch(`/capture/${data.orderID}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((data) => {
          swal("Order Captured!", `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${data.purchase_units[0].payments.captures[0].amount.currency_code} ${data.purchase_units[0].payments.captures[0].amount.value}`, "success");
        })
        .catch(console.error);
    },
    onCancel(data, actions) {
      swal("Order Canceled", `ID: ${data.orderID}`, "warning");
    },
    onError(err) {
      console.error(err);
    },
  })
  .render('#bancontact-btn')

/* radio buttons */

document.getElementById('bancontact-container').style.display = 'none'
document.getElementById('bancontact-btn').style.display = 'none'

// Listen for changes to the radio buttons
document.querySelectorAll('input[name=payment-option]').forEach(el => {
  // handle button toggles
  el.addEventListener('change', event => {
    switch (event.target.value) {
      case 'paypal':
        document.getElementById('bancontact-container').style.display = 'none'
        document.getElementById('bancontact-btn').style.display = 'none'

        document.getElementById('paypal-btn').style.display = 'block'

        break
      case 'bancontact':
        document.getElementById('bancontact-container').style.display = 'block'
        document.getElementById('bancontact-btn').style.display = 'block'

        document.getElementById('paypal-btn').style.display = 'none'
        break

      default:
        break
    }
  })
})
