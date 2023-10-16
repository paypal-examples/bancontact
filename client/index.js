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
        fontFamily: "'Helvetica Neue', Arial, sans-serif", // applies to all payment fields text
        fontSizeBase: "0.9375rem", // applies to input, placeholder, and dropdown text values
        fontSizeM: "0.93rem", // the payment fields title description
        textColor: "#2c2e2f", // applies payment fields title description, input, and dropdown text
        colorTextPlaceholder: "#2c2e2f", // applies to the placeholder text
        colorBackground: "#fff", // background color of the input and dropdown fields
        colorDanger: "#d20000", // applies to the invalid field border and validation text
        borderRadius: "0.2rem", // for the input and dropdown fields
        borderColor: "#dfe1e5", // for the input and dropdown fields
        borderWidth: "1px", // for the input and dropdown fields
        borderFocusColor: "black", // color for the invalid field border and validation text
        // spacingUnit: "10px", // spacing between multiple input fields, bancontact has one input field
      },

      // set custom rules to apply to fields classes (optional)
      rules: {
        ".Input": {}, // overwrite properties for the input fields
        ".Input:hover": {}, // applies to the input field on mouse hover
        ".Input:focus": { // applies to the focused input field
          color: 'blue',
          boxShadow: '0px 2px 4px rgb(0 0 0 / 50%), 0px 1px 6px rgb(0 0 0 / 25%)',
        },
        ".Input:active": {}, // applies when input fields are clicked
        ".Input--invalid": {}, // applies to input fields when invalid input is entered
        ".Label": {}, // overwrite properties for the input field labels
      },
    },

    fields: {
      // fields prefill info (optional)
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
