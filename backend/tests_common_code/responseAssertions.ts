import * as assert from "node:assert/strict";

export function assertResponseIs200(response: any) {
    assert.equal(response.status, 200);
}

export function assertResponseIs500(response: any) {
    assert.equal(response.status, 500);
}

export function assertResponseHasField(fieldName: string, actualResponse: any) {
    assert.ok(Object.hasOwn(actualResponse.body, fieldName))
}

export function assertFieldHasValue(response, fieldName, expectedValue) {
    assertResponseHasField(fieldName, response);
    assert.equal(response.body[fieldName], expectedValue);
}