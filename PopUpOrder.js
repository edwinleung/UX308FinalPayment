const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    FOOD:   Symbol("food"),
    BOBA:  Symbol("boba")
});

module.exports = class PopUpOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sFood = "";
        this.sBoba = "";
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.FOOD;
                aReturn.push("Welcome to Tastes of Asia.");
                aReturn.push(`For a list of upcoming craft kits, tap here:`);
                aReturn.push("https://edwinleung.github.io/UX308Final/");
                aReturn.push("Would you like FLOAM SLIME, RAMEN BURGER, or BOTH?");
                break;
            case OrderState.FOOD:
                this.stateCur = OrderState.BOBA;
                  this.sFood = sInput;
                  aReturn.push("Would you like BOBA with that?");
                break;
            case OrderState.BOBA:
                if(sInput.toLowerCase() != "no"){
                    this.sBoba = sInput;
                }
                aReturn.push("Thank-you for your order of");
                this.nTotal = 0;
                if(this.sFood.toLowerCase() == "fried chicken"){
                  aReturn.push("Spicy Korean Fried Chicken");
                  this.nTotal += 10.00;
                }else if(this.sFood.toLowerCase() == "ramen burger"){
                  aReturn.push("Ramen Burger");
                  this.nTotal += 13.00
                }else if(this.sFood.toLowerCase() == "both"){
                    aReturn.push("Spicy Korean Fried Chicken and Ramen Burger");
                    this.nTotal += 23.00
                }    
                if(this.sBoba){
                  aReturn.push("Xing Fu Tang Brown Sugar Boba");
                  this.nTotal += 6.50;
                }
                aReturn.push(`Your total comes to $${this.nTotal}`);
                aReturn.push(`We will text you from 519-222-2222 when your order is ready or if we have questions.`)
                this.isDone(true);
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your order of ${this.sItem} for ${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}