let cocktailData, userInput;
const $name = $('#name');
const $description = $('#description');
const $input = $('input[type="text"]');
const pictureDiv = document.querySelector('#picture')
$('form').on('submit', handleGetData);

function handleGetData(event) {
    document.querySelector("#ingreds").innerHTML = null
    event.preventDefault();
    userInput = $input.val();
    $.ajax({
        url:'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + userInput
      }).then(
        (data) => {
        cocktailData = data;
        $.ajax({
            url:'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list'
        }).then(
            (data) => {
                allRandomWrongIngredients = data;
                // console.log(allRandomWrongIngredients);
                // console.log(cocktailData);
                render();
            },
            (error) => {
                console.log('bad request', error);
            }
        ) 
        },
        (error) => {
         console.log('bad request', error);
        }
    );   
}

function render() {
    $name.text(cocktailData.drinks[0].strDrink)
    $description.text(cocktailData.drinks[0].strInstructions);
    pictureDiv.innerHTML = `<img src=${cocktailData.drinks[0].strDrinkThumb} alt="${cocktailData.drinks[0].strDrink}">`
    let ingredsdiv = document.querySelector('#ingreds')
    let totalIngredSentence = document.querySelector('#totalIngreds') 
    let rightAndWrongIngred = []
  
    for (let i=1; i<16; i++){
        let ingredient = cocktailData.drinks[0][`strIngredient${i}`]
        if (ingredient){
        let ingreddiv = document.createElement('div')
        ingreddiv.setAttribute('id', `ingred${i}`)
        ingreddiv.setAttribute('class', `ingred`)
        ingreddiv.innerText = ingredient
        // ingredsdiv.appendChild(ingreddiv)
            let ingredPic = document.createElement('div')
            ingredPic.innerHTML = `<img src="https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png" alt="${ingredient}">`
            ingreddiv.appendChild(ingredPic)
            rightAndWrongIngred.push(ingreddiv)
        }
    }    
    let allIngredients = document.querySelectorAll('.ingred')
    let totalIngredients = []
    allIngredients.forEach(ingredient=>{
        if (ingredient.innerText) {
            totalIngredients.push(ingredient)
        }
    })
    totalIngredSentence.innerHTML = `<p>There are ${rightAndWrongIngred.length} total correct ingredients in this drink! Choose the correct ingredients to make the drink!</p>`
    rightAndWrongIngred.forEach(ingredient=>{
        let getWrongIngred = () =>{
            let wrongIngred = allRandomWrongIngredients.drinks[Math.floor(Math.random()*100)].strIngredient1
            while (wrongIngred===cocktailData.drinks[0][`strIngredient1`] || wrongIngred===cocktailData.drinks[0][`strIngredient2`] || wrongIngred===cocktailData.drinks[0][`strIngredient3`] || wrongIngred===cocktailData.drinks[0][`strIngredient4`] || wrongIngred===cocktailData.drinks[0][`strIngredient5`] || wrongIngred===cocktailData.drinks[0][`strIngredient6`] || wrongIngred===cocktailData.drinks[0][`strIngredient7`] || wrongIngred===cocktailData.drinks[0][`strIngredient8`] ||wrongIngred===cocktailData.drinks[0][`strIngredient9`] ||wrongIngred===cocktailData.drinks[0][`strIngredient10`] ||wrongIngred===cocktailData.drinks[0][`strIngredient11`] ||wrongIngred===cocktailData.drinks[0][`strIngredient12`] ||wrongIngred===cocktailData.drinks[0][`strIngredient13`] ||wrongIngred===cocktailData.drinks[0][`strIngredient14`] ||wrongIngred===cocktailData.drinks[0][`strIngredient15`]){
                console.log('repeat');
                let wrongIngred = allRandomWrongIngredients.drinks[Math.floor(Math.random()*100)].strIngredient1
                return wrongIngred
            }
            return wrongIngred
        }
        wrongIngred = getWrongIngred()
        let wrongIngredDiv = document.createElement('div')
        wrongIngredDiv.setAttribute('class', 'wrong')
        let wrongIngredPic = document.createElement('div')
        wrongIngredDiv.innerText = wrongIngred
        wrongIngredPic.innerHTML = `<img src="https://www.thecocktaildb.com/images/ingredients/${wrongIngred}-Small.png" alt="${wrongIngred}">`
        wrongIngredDiv.appendChild(wrongIngredPic)
        // ingredsdiv.appendChild(wrongIngredDiv)
        rightAndWrongIngred.push(wrongIngredDiv)
        // console.log(wrongIngred);
    })
    // console.log(rightAndWrongIngred);
    // const shuffledArray = array.sort(() => Math.random() - 0.5);
    rightAndWrongIngred.sort(() => Math.random() - 0.5).forEach(ingred=>{
        // console.log(ingred);
        ingredsdiv.append(ingred)
    })
    let ingredsDiv = document.querySelectorAll('.ingred')
    let checkForWin = ()=>{
        let mixedDrink = []
        ingredsDiv.forEach(div=>{
            if(div.style.backgroundColor==='green'){
                mixedDrink.push(div)
            }
            if(mixedDrink.length===(rightAndWrongIngred.length/2)){
                console.log('winner');
                // $name.empty()
                //use .append()
                // instead of Cocktail Mixer
                //            what do you want to make
                //do Congrationalists you mixed a drink!
                // do you want to make another one?
            }
        })
    }
    let $correctIngreds = $('.ingred')
    $correctIngreds.on('click', (e) => {
        // console.log(e);
        if (e.target.localName==='img'){
            $(e.target.parentElement.parentElement).css("background-color", "green")
            checkForWin()
            return
        }
        $(e.target).css("background-color", "green")  
        checkForWin()
    }) 
    
    let $wrongIngreds = $('.wrong')
    $wrongIngreds.on('click', (e) => {
        if (e.target.localName==='img'){
            $(e.target.parentElement.parentElement).css("background-color", "red")
            setTimeout(function(){
                $(e.target.parentElement.parentElement).css("background-color", "transparent")
            }, 300)
        }
        $(e.target).css("background-color", "red")
        setTimeout(function(){
            $(e.target).css("background-color", "transparent")
        }, 300)
    })   
   
    
    // ingredsDiv.forEach(div=>{
    //     if(div.style.backgroundColor==="green"){
    //         console.log('hi');
    //     }
    // })
    // console.log($correctIngreds);
    // console.log(totalIngredients.length);
    // console.log(allRandomWrongIngredients);
}
// when all correct are green, win
// $ .empty
// see if you can make the style grid for ingreds to adjust to the amount you show

