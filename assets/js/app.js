
/* global HTMLButtonElement, HTMLDivElement */


class XCart extends HTMLButtonElement {
    
    attachedCallback () {
        
        var img = document.createElement("img");
        img.setAttribute("src", 
            "cards/" + 
            this.getAttribute("number") + 
            "_of_" + this.getAttribute("image") + ".svg");
        img.setAttribute("async", true);
        this.appendChild(img);
        this.setAttribute("tab-index", -1);
        
        this.addEventListener("click", this.onClick.bind(this));
        this.addEventListener("keypress", this.onKeyPress.bind(this));
        
    }
    
    onClick () {
        console.debug("clicked", this);
        this.setAttribute("hidden", true);
    }
    
    onKeyPress () {
        this.setAttribute("hidden", true);
    }
    
    get points () {
        let p = this.getAttribute("points");
        try {
            return parseInt(p);
        } catch (e) {
            return 0;
        }
    }
    
}

document.registerElement("x-cart", XCart);


class XDeck extends HTMLDivElement {

    static get IMAGE_CLASSES () {
        return ["diamonds", "clubs", "hearts", "spades"];   
    }
    
    static get NUMBER_CLASSES () {
        return ["10", "jack", "queen", "king", "ace"];
    }
    
    static get POINTS () {
        return [10, 2, 3, 4, 11];
    }

    static get DECK_CARDS () {
        let cartDeck = [];
        [0, 1].forEach(() => {
            XDeck.IMAGE_CLASSES.forEach(image => {
                XDeck.NUMBER_CLASSES.forEach((nbr, index) => {
                    cartDeck.push({
                        number: nbr,
                        image: image,
                        points: XDeck.POINTS[index]
                    });
                });
            });
        });
        return cartDeck;
    }
    
    clear () {
        this.innerHTML = "";
    }
    
    _setRandomCards () {
        let cardCount = this.getAttribute("deck-count");
        cardCount = parseInt(cardCount);
        if (isNaN(cardCount)) {
            cardCount = Math.floor(Math.random() * XDeck.DECK_CARDS.length);
        }
        console.log("randomDeckCount", cardCount);
        let deck = this._getRandomDeck(cardCount);
        deck.forEach(cart => {
            let cartElem = document.createElement("x-cart");
            cartElem.setAttribute("number", cart.number);
            cartElem.setAttribute("image", cart.image);
            cartElem.setAttribute("points", cart.points);
            cartElem.classList.add("cart-base");
            this.appendChild(cartElem);
        });   
    }
    
    _getRandomDeck (cartsQuantity) {
        var alreadySelected = [],
            selection = [],
            ok = false,
            randId;
    
        cartsQuantity = (cartsQuantity || 20);
    
        for (let i = 0; i < cartsQuantity; i++) {
            do {
                randId = Math.floor(Math.random() * XDeck.DECK_CARDS.length);    
                
                if (alreadySelected.indexOf(randId) > -1) {
                    ok = false;
                } else {
                    ok = true;
                }
                
            } while (!ok);
            
            selection.push(XDeck.DECK_CARDS[randId]);
            
            ok = false;
        }
        
        return selection;
    
    }
    
    _setResultElement () {
        let resultButton = document.createElement("button");
        resultButton.classList.add("cart-base");
        resultButton.classList.add("cart-result");
        resultButton.innerHTML = "result";
        this.appendChild(resultButton);
        
        this.insertBefore(resultButton, this.querySelector(":first-child"));
        
        let points = 0;
        
        [].forEach.call(
            this.querySelectorAll("x-cart"), 
            function (cartElem) {
            
                points += cartElem.points;
            
            });
        
        resultButton.innerHTML = points;
        
    }
    
    _setAskElement () {
        let askElement = document.createElement("button");
        askElement.classList.add("cart-base");
        askElement.classList.add("cart-pre-result");
        askElement.innerHTML = "??";
        askElement.addEventListener("click", (evt) => {
            evt.currentTarget.setAttribute("hidden", true);
        });
        
        this.appendChild(askElement);
    }
    
    deal () {
        this.clear();
        this._setAskElement();
        this._setRandomCards();
        this._setResultElement();
    }

    attachedCallback () {
        if (this.hasAttribute("auto-deal")) {
            this.deal();    
        }
    }
    
}

document.registerElement("x-deck", XDeck);


function deal () {
    document.querySelector("x-deck").deal();
}