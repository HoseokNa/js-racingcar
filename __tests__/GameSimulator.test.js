import GameSimulator from '../src/GameSimulator';
import { MAX_ROUNDS } from '../src/GameSimulator/constants';
import { validateCarName } from '../src/GameSimulator/utils';
import { getUserInputByQuestion } from '../src/utils/getUserInputByQuestion';

jest.mock('../src/utils/getUserInputByQuestion');

describe('GameSimulator 테스트', () => {
  let simulator = null;

  beforeEach(() => {
    simulator = simulator = new GameSimulator();
  });

  describe('입력 테스트', () => {
    const CAR_NAMES = ['자동차1', '자동차2', '자동차3', '자동차4', '자동차5'];

    beforeEach(() => {
      getUserInputByQuestion.mockImplementation(() =>
        Promise.resolve(CAR_NAMES.join(','))
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('게임을 시작하면 경주할 자동차를 입력 받을 수 있다.', () => {
      simulator.startGame();

      expect(getUserInputByQuestion).toHaveBeenCalled();
    });

    describe('자동차 이름 검증 테스트', () => {
      test('자동차 이름 길이가 5보다 작으면 에러가 발생하지 않는다.', () => {
        CAR_NAMES.forEach((name) =>
          expect(() => validateCarName(name)).not.toThrow()
        );
      });

      test('자동차 이름 길이는 최대 5글자다.', () => {
        const carNames = ['최대다섯글자', '최대다섯글자입니다'];

        carNames.forEach((name) =>
          expect(() => validateCarName(name)).toThrow()
        );
      });

      test('자동차 이름이 빈 글자이면 안된다.', () => {
        const carNames = ['', ''];

        carNames.forEach((name) =>
          expect(() => validateCarName(name)).toThrow()
        );
      });
    });

    describe('자동차 주행 테스트', () => {
      test('자동차 입력을 받은 후 startRound 함수가 호출 된다.', async () => {
        const startRoundSpy = jest.spyOn(simulator, 'startRound');

        await simulator.startGame();

        expect(startRoundSpy).toHaveBeenCalled();

        startRoundSpy.mockRestore();
      });

      test('round는 5회동안 진행된다.', async () => {
        const runRoundSpy = jest.spyOn(simulator, 'runRound');

        await simulator.startGame();

        expect(runRoundSpy).toBeCalledTimes(MAX_ROUNDS);

        runRoundSpy.mockRestore();
      });
    });
  });

  describe('우승 테스트', () => {
    describe('우승한 자동차의 이름을 확인 할 수 있다.', () => {
      test('우승자가 1명일 때 배열의 길이가 1이다', async () => {
        getUserInputByQuestion.mockImplementation(() =>
          Promise.resolve('자동차1')
        );

        await simulator.startGame();

        expect(simulator.getWinningCarNames().length).toBe(1);
      });

      test('우승자가 여러명일 떄는 배열의 길이가 0보다 크다', async () => {
        await simulator.startGame();

        expect(simulator.getWinningCarNames().length > 0).toBe(true);
      });
    });

    describe('우승한 자동차의 이름을 출력한다.', () => {
      test('우승자가 1명일 때', async () => {
        const winningCarName = '우승';

        getUserInputByQuestion.mockImplementation(() =>
          Promise.resolve(winningCarName)
        );

        const logSpy = jest.spyOn(console, 'log');

        await simulator.startGame();

        expect(logSpy).toHaveBeenCalledWith(
          `${winningCarName}가 최종 우승했습니다.`
        );

        logSpy.mockRestore();
      });

      test('우승자가 여러명일 떄는 ,로 구분해서 출력한다.', async () => {
        const logSpy = jest.spyOn(console, 'log');

        await simulator.startGame();

        expect(logSpy).toHaveBeenCalledWith(
          `${simulator.getWinningCarNames().join(',')}가 최종 우승했습니다.`
        );

        logSpy.mockRestore();
      });
    });
  });
});
