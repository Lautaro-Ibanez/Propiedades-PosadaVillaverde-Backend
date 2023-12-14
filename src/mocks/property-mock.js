import { faker } from "@faker-js/faker/locale/es_MX";

export const generateProperty = () => {
  const types = ["Casa", "Salon", "Departamento", "Quinta"];
  const operations = ["Comprar", "Alquiler", "Alquiler Temporal"];
  const images = [
    "property-images/7.jfif",
    "property-images/1.jfif",
    "property-images/2.jfif",
    "property-images/3.jfif",
    "property-images/4.jfif",
    "property-images/5.jfif",
    "property-images/6.jfif",
    "property-images/8.jfif",
    "property-images/9.jfif",
    "property-images/10.jfif",
    "property-images/11.jfif",
    "property-images/12.jfif",
    "property-images/13.jfif",
  ];
  const zones = ["Flores", "Tortuguitas", "Palermo", "San Miguel"];

  const money = ["$", "U$D"];

  const features = [
    "Piscina",
    "Parrilla",
    "Garaje",
    "Jardin",
    "Terraza",
    "Gas natural",
    "Gas envasado",
    "Despensas: $12.000",
    "Internet",
    "Jardin",
  ];

  function generateRandomPosition() {
    var latitud = Math.random() * 180 - 90;

    var longitud = Math.random() * 360 - 180;

    return { lat: latitud, lng: longitud };
  }

  const randomNumber = (max) => {
    let random = Math.floor(Math.random() * max);
    if (random < 4) {
      random = 4;
    }
    return random;
  };

  const randomType = (opciones) => {
    const randomIndex = Math.floor(Math.random() * opciones.length);
    return opciones[randomIndex];
  };

  const arrayRandom = (number, array) => {
    let randomArray = [];
    for (let i = 0; i < number; i++) {
      randomArray.push(randomType(array));
    }
    return randomArray;
  };

  return {
    id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    price: {
      price: faker.number.int({ min: 75000, max: 350000 }),
      money: randomType(money),
    },
    landSize: faker.number.int({ min: 150, max: 1000 }),
    coveredGround: faker.number.int({ min: 50, max: 120 }),
    bathrooms: faker.number.int({ min: 1, max: 3 }),
    dormitory: faker.number.int({ min: 1, max: 4 }),
    environments: faker.number.int({ min: 1, max: 5 }),
    type: randomType(types),
    zone: randomType(zones),
    direction: faker.location.streetAddress(false),
    operation: randomType(operations),
    features: arrayRandom(randomNumber(features.length), features),
    images: arrayRandom(randomNumber(images.length), images),
    description: faker.lorem.paragraph({ min: 3, max: 6 }),
    position: generateRandomPosition(),
  };
};
