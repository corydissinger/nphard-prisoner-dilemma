(() => {
    // Shameless copypasta: https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d
    const switchcase = cases => defaultCase => key =>
      key in cases ? cases[key] : defaultCase            
    
    // SIDE EFFECTS???!?!
    const operationForArbitraryPrisoner = (aCurrentBoxState, isLeader, iterationType) => {
        return switchcase({
            // The initial state OR 'reset' state [0, 0]. If leader observes, no touch.
            'INITIAL_TO_OBSERVED' : () => !isLeader ? aCurrentBoxState : 1,

            // Another non-leader needs to prove they've seen it... [1, 0] OR [0, 1] OR [1, 1]
            'OBSERVED_TO_FINAL': () => !isLeader ? aCurrentBoxState : 2,        
            
            // This ternary expression says...
            // if leader then increment observed outcomes then compare to 99 if 99 return 2 otherwise 0; if not leader the box remains unchanged
            'FINAL_TO_INITIAL_OR_TERMINATION' : () => isLeader ? ++observedSatisfactoryOutcomes === 99 ? 3 : 0 : aCurrentBoxState

        // Default is here.
        })(() => {
            console.log("This default case inside operationForArbitraryPrisoner should not happen");
            return aCurrentBoxState;
        })(iterationType);
    }
    
    const switchBoxStateToIterationType = switchcase(
        {
            0: 'INITIAL_TO_OBSERVED',
            1: 'OBSERVED_TO_FINAL',
            2: 'FINAL_TO_INITIAL_OR_TERMINATION'
        }        
        // Default case shouldn't happen... :S
    )(() => {});

    // Returns 0..100 inclusive at random, if I understand correctly
    const evilWardenRandomlyPicksSomething = () => Math.floor(Math.random() * 101);
    
    let observedSatisfactoryOutcomes = 0;    
    let currentBoxState = 0;
    let freshObservers = new Array(99).fill(true);
    let sillyCallCounter = 0; //Should not exist in a production type sense. SHOULD exist for a sanity type sense.
    
    do {
        console.log(`Current call counter ${sillyCallCounter++}`);
        const something = evilWardenRandomlyPicksSomething();                
        const isLeader = something === 99;
        const isNotNothing = something !== 100;
        
        // This negation sound strange here
        if(something < 99 && !freshObservers[something]) continue;
        
        console.log(`box state = ${currentBoxState}`);
        console.log(`entity = ${isLeader ? 'leader' : isNotNothing ? 'prisoner' : 'nothing'}`);                
        
        // Don't do a damn thing in this case. 
        if(!isNotNothing) continue;
        
        const iterationType = switchBoxStateToIterationType(currentBoxState);
        
        // Maximum spookiness...
        if(!iterationType) continue;
        
        console.log(`iteration type = ${iterationType}`);
        
        currentBoxState = isNotNothing ? operationForArbitraryPrisoner(currentBoxState, isLeader, iterationType)() : currentBoxState;
        
        //Disqualify the observer from future consideration since they are no longer allowed to touch the box.
        if(currentBoxState === 2 && isNotNothing && !isLeader) {
            freshObservers[something] = false;
        }
        
        console.log(`outcomes observed: ${observedSatisfactoryOutcomes}`);                
    } while(currentBoxState !== 3);

    //Done... for real!
    return "done"; // ... everyone comes out alive, right?
})();
