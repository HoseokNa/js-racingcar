import Car from '../src/Car';
import RacingGame from '../src/RacingGame';

describe('RacingGame 테스트', () => {
  const carNames = ['자동차1', '자동차2', '자동차3'];
  let cars = null;
  let racingGame = null;

  beforeEach(() => {
    cars = carNames.map((name) => new Car(name));
    racingGame = new RacingGame(cars);
  });

  describe('레이싱 게임 세팅 테스트', () => {
    test('경주에 참여할 자동차들이 있다.', () => {
      expect(racingGame.getCars().every((car) => car instanceof Car)).toBe(
        true
      );
    });
  });

  describe('레이싱 게임 우승 테스트', () => {
    test('가장 멀리 간 거리를 구할 수 있다.', () => {
      cars.forEach((car, index) => {
        for (let i = 0; i < index; i++) {
          car.moveForward();
        }
      });

      expect(racingGame.getMaxDistanceDriven()).toBe(2);
    });

    test('우승한 자동차를 구할 수 있다.', () => {
      cars.forEach((car, index) => {
        for (let i = 0; i < index; i++) {
          car.moveForward();
        }
      });

      const [winningCar] = racingGame.getWinningCars();
      const lastCar = cars.at(-1);

      expect(winningCar).toEqual(lastCar);
    });
  });
});
