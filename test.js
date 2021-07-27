class Food {
  constructor(name) {
    this.name = name;
    this.statuses = [];
  }
}

class Plate {
  constructor(name) {
    this.name = name;
    this.foods = [];
  }
}

const boil = food => (new Promise(resolve => setTimeout(() => resolve({ ...food, statuses: [...food.statuses, "Boiled"] }), 4000)));
const cut = food => new Promise(resolve => setTimeout(() => resolve({ ...food, statuses: [...food.statuses, "Cut"] }), 1000));
const fry = food => new Promise(resolve => setTimeout(() => resolve({ ...food, statuses: [...food.statuses, "Fried"] }), 3000));
const toast = food => new Promise(resolve => setTimeout(() => resolve({ ...food, statuses: [...food.statuses, "Toasted"] }), 2000));
const put = (...foods) => ({ on: async dish => ({ ...dish, foods: [...dish.foods, ...foods] }) });
const showContents = (...dishes) => dishes.forEach(dish => console.info(`On the ${dish.name}:\n${dish.foods.map(food => ` ${food.statuses.join(" ")} ${food.name}`).join("\n")}`));

const bread = new Food("Bread");
const egg = new Food("Egg");
const sausage = new Food("Sausage");
const lettuce = new Food("Lettuce");
const cucumber = new Food("Cucumber");

const breadPlate = new Plate("Bread Plate");
const sideDish = new Plate("Side Dish");
const saladBowl = new Plate("Sald Bowl");

(async () => {
  console.time("Cooking Timer");

  // 四捨五入して7秒以内に朝食を作ってください。
  // showContents(dish) (showContents(dish1, dish2, ...)) で以下の内容が出力されればOK
  //  On the Bread Plate:
  //   Toasted bread
  //  On the Side Dish:
  //   Boiled Cut Egg
  //   Fried Sausage
  // In the Salad Bowl:
  //   Cut Lettuce
  //   Cut Cucumber

  showContents(... await Promise.all([
    toast(bread).then(bread => put(bread).on(breadPlate)),
    Promise.all([boil(egg).then(egg => cut(egg)), fry(sausage)]).then(foods => put(...foods).on(sideDish)),
    Promise.all([cut(lettuce), cut(cucumber)]).then(foods => put(...foods).on(saladBowl))
  ]));


  console.timeEnd("Cooking Timer");
})();
