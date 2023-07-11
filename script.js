let cocktailData, userInput;
const $name = $('#name');
const $description = $('#description');
const $input = $('input[type="text"]');
const pictureDiv = document.querySelector('#picture')
const $winningMessage = $('#winningMessage')
const $strikeCounter = $('#strikeCounter')
$('form').on('submit', handleGetData);

function handleGetData(event) {
    pictureDiv.style.height = '0px'
    pictureDiv.style.width = '0px'
    document.querySelector("#ingreds").innerHTML = null
    event.preventDefault();
    pictureDiv.innerHTML=""
    $winningMessage.empty()
    $name.empty()
    $description.empty()
    $strikeCounter.empty()
    $('#totalIngreds').empty()
    if ($input.val()===""){
        return 
    }
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
    $description.text(`To make the ${cocktailData.drinks[0].strDrink}: `+cocktailData.drinks[0].strInstructions);
    let ingredsdiv = document.querySelector('#ingreds')
    let totalIngredSentence = document.querySelector('#totalIngreds') 
    let rightAndWrongIngred = []
    let strikes = 0
    $strikeCounter.text('You have 4 strikes remaining')
    for (let i=1; i<16; i++){
        let ingredient = cocktailData.drinks[0][`strIngredient${i}`]
        if (ingredient){
        let ingreddiv = document.createElement('div')
        ingreddiv.setAttribute('id', `ingred${i}`)
        ingreddiv.setAttribute('class', `ingred`)
        ingreddiv.innerText = ingredient
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
    totalIngredSentence.innerHTML = `<p>There are ${rightAndWrongIngred.length} total correct ingredients in this drink! Choose the correct ingredients to make the drink...Don't pick the wrong ingredients though...You don't want your drink to be trash!</p>`
    rightAndWrongIngred.forEach(ingredient=>{
        let getWrongIngred = () =>{
            let wrongIngred = allRandomWrongIngredients.drinks[Math.floor(Math.random()*100)].strIngredient1
            while (wrongIngred===cocktailData.drinks[0][`strIngredient1`] || wrongIngred===cocktailData.drinks[0][`strIngredient2`] || wrongIngred===cocktailData.drinks[0][`strIngredient3`] || wrongIngred===cocktailData.drinks[0][`strIngredient4`] || wrongIngred===cocktailData.drinks[0][`strIngredient5`] || wrongIngred===cocktailData.drinks[0][`strIngredient6`] || wrongIngred===cocktailData.drinks[0][`strIngredient7`] || wrongIngred===cocktailData.drinks[0][`strIngredient8`] ||wrongIngred===cocktailData.drinks[0][`strIngredient9`] ||wrongIngred===cocktailData.drinks[0][`strIngredient10`] ||wrongIngred===cocktailData.drinks[0][`strIngredient11`] ||wrongIngred===cocktailData.drinks[0][`strIngredient12`] ||wrongIngred===cocktailData.drinks[0][`strIngredient13`] ||wrongIngred===cocktailData.drinks[0][`strIngredient14`] ||wrongIngred===cocktailData.drinks[0][`strIngredient15`]){
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
        rightAndWrongIngred.push(wrongIngredDiv)
    })
    function organize() {
        document.querySelector("#ingreds").style.gridTemplateColumns = `repeat(${rightAndWrongIngred.length/2}, 100px)`
    }
    organize()
    rightAndWrongIngred.sort(() => Math.random() - 0.5).forEach(ingred=>{
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
                $winningMessage.text(`Congratulations you did it!! That looks like one super yummy ${cocktailData.drinks[0].strDrink}!!`)
                $name.empty()
                $description.empty()
                $strikeCounter.empty()
                pictureDiv.innerHTML = `<img class="ender" src=${cocktailData.drinks[0].strDrinkThumb} alt="${cocktailData.drinks[0].strDrink}">`
                document.querySelector(".ender").style.height = '600px'
                document.querySelector(".ender").style.width = '800px'
                $('#totalIngreds').empty()
                $('#ingreds').empty()
                console.log(mixedDrink);
            }
        })
    }
    let $correctIngreds = $('.ingred')
    $correctIngreds.on('click', (e) => {
        console.log(e);
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
                $(e.target.parentElement.parentElement).css("background-color", "aliceblue")
            }, 300)
        }
        $(e.target).css("background-color", "red")
        setTimeout(function(){
            $(e.target).css("background-color", "aliceblue")
        }, 300)
        strikes++
        $strikeCounter.text(`You have ${4-strikes} strikes remaining`)
        if (strikes>=4){
            $winningMessage.text(`Wow...you suck at this...your drink is trash!`)
            $name.empty()
            $description.empty()
            let trashNumber= Math.floor(Math.random()*5)
                if (trashNumber===0){
                    pictureDiv.innerHTML = `<img class="ender" src="https://150086115.v2.pressablecdn.com/wp-content/uploads/2023/02/mariners-1.jpg" alt="trash">`
                } else if (trashNumber===1){
                    pictureDiv.innerHTML = `<img class="ender" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk8ZSurC6QkONwryKpw46k35GyZXhChhTi5EdQJjL-jdQwIoklsWx0HTvlrQzvm1sbZQY&usqp=CAU" alt="trash">`
                } else if (trashNumber===2){
                    pictureDiv.innerHTML = `<img class="ender" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdyl_AFmy1TIF_hZUsQ_gBmfTAG59mHddj4A&usqp=CAU" alt="trash">`
                } else if (trashNumber===3){
                    pictureDiv.innerHTML = `<img class="ender" src="https://static1.squarespace.com/static/5c4e41d2b40b9d6e2ab467ff/5f0753f106ae4a6c681236a2/60223780feeb7a09fd706509/1624472895548/residential-trash-services.jpg?format=1500w" alt="trash">`
                } else if (trashNumber===4){
                    pictureDiv.innerHTML = `<img class="ender" src="https://www.providencejournal.com/gcdn/authoring/2019/12/06/NPRJ/ghows-PJ-9908499a-c755-6b5d-e053-0100007fe9fe-0d7f8468.jpeg" alt="trash">`
                }
            document.querySelector(".ender").style.height = '600px'
            document.querySelector(".ender").style.width = '800px'
            $('#totalIngreds').empty()
            $('#ingreds').empty()
            $strikeCounter.empty()
        }
    })   
}

//readme
//github
//fix div/image glitch on the box changing color
//e.target local name on the glitch says 'div'
//try adding a class called sliver