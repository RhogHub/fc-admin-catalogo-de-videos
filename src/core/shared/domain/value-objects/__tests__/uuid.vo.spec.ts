import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from 'uuid';

describe('Uuid Unit Test', () => {
    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');
    test('should throw error when uuid is invalid', () => {
        expect(() => {
            new Uuid("invalid-uuid");
        }).toThrow(new InvalidUuidError());
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a valid uuid', () => {
        const uuid = new Uuid();
        expect(uuid.id).toBeDefined();
        expect(uuidValidate(uuid.id)).toBe(true);
        expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should accept a valid uuid', () => {
        const uuid = new Uuid('7a236412-d2f7-4518-baf3-c15374485d3b');
        expect(uuid.id).toBe('7a236412-d2f7-4518-baf3-c15374485d3b');  
        expect(validateSpy).toHaveBeenCalledTimes(1);      
    });
});