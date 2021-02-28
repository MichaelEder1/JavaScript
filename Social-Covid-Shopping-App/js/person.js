/**
 * @author Michael Eder (S1910456008)
 */

let personId = 0;

export default class Person
{
    constructor(firstName, lastName, job)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.job = job; //0 = Hilfesuchend | 1 = Hilfeleistend
        this.personId = personId;
        personId++;
    }
}