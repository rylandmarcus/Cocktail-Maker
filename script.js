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
         render();
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
    for (let i=1; i<16; i++){
        let ingredient = cocktailData.drinks[0][`strIngredient${i}`]
        let ingredsdiv = document.querySelector('#ingreds')
        let ingreddiv = document.createElement('div')
        ingreddiv.setAttribute('id', `ingred${i}`)
        ingreddiv.setAttribute('class', `ingred`)
        ingreddiv.innerText = ingredient
        ingredsdiv.appendChild(ingreddiv)
        if (ingredient){
            let ingredPic = document.createElement('div')
            ingredPic.innerHTML = `<img src="https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png" alt="${ingredient}">`
            ingreddiv.appendChild(ingredPic)
        }
    }    
    let allIngredients = document.querySelectorAll('.ingred')
    let totalIngredients = []
    allIngredients.forEach(ingredient=>{
        if (ingredient.innerText) {
            totalIngredients.push(ingredient)
        }
    })
    console.log(totalIngredients.length);
}

