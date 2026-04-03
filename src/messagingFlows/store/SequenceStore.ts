
import type { LgonContext } from "../../application/context/LgonContext.js";
import type { LgonId, LgonIdKind } from "../../types/LgonId.js";
import type { Flow, SequenceDefinition } from "../model/Flow.js";
import type { SequenceView, MessageView, SequenceContext } from "../model/View.js"; 
import { SequenceSession } from "../model/SequenceSession.js";
import { sequenceViewOf } from "../model/View.js";

export class SequenceStore
{
    private sequences: Map<string, SequenceSession>;
	private n: number;
	private min: number;

    constructor(public readonly lgon: LgonContext)
	{
		this.sequences = new Map<string, SequenceSession>();
		this.n = 0;
		this.min = 0;
	}



	static	sequenceHasInteraction(sequenceDef: SequenceDefinition): boolean
	{
		let i: number = 0;
		let j: number;
		let len: number;

		while ( i < sequenceDef.steps.length )
		{
			len = sequenceDef.steps[i].modes.length;
			if (len > 1)
				return (true);
			if (len === 0)
			{
				i ++
				continue;
			}

			if ( sequenceDef.steps[i].modes[0].interactions.some(interactionRow => (interactionRow.length > 0)) )
				return (true);
			i ++;
		}
		return (false);
	}

	private	addSequence(sequenceContext: SequenceContext, sequenceDef: SequenceDefinition): void
	{
		if ( !SequenceStore.sequenceHasInteraction(sequenceDef) )
			return ;
	
		const sequenceId: string = this.n.toString();
		this.n ++;
		
		const session: SequenceSession = new SequenceSession(this.lgon, sequenceId, sequenceContext, sequenceDef);
		this.sequences.set(sequenceId, session);		
	}

	add(contextId: LgonId<LgonIdKind> , userId: LgonId<"user">, flowDef: Flow): SequenceView[]
	{ 
		let sequenceView: SequenceView = [];
		let lobbyViews: SequenceView[] = [];
		let sequenceContext: SequenceContext;
		
		let	i: number = 0;
		while ( i < flowDef.length )
		{
			if ( flowDef[i].steps.length === 0 )
			{
				i ++;
				continue ;
			}

			sequenceContext =
			{
				contextId: contextId,
				userId: userId,
				step: 0,
				stepMode: this.lgon.getUserStepMode(userId)
			}

			this.addSequence(sequenceContext, flowDef[i ++]);
			lobbyViews.push(sequenceViewOf(flowDef[i], sequenceContext));
		}

		return ( lobbyViews );
	}

	rm(sequenceId: string)
	{
		const rmBool: boolean = this.sequences.delete(sequenceId);
		if ( rmBool )
		{
			let  i: number = parseInt(sequenceId);
			if (i === this.min)
			{
				i ++;
				while ( !this.sequences.has(i.toString()) )
					i ++;
				this.min = i - 1;
			}
		}
	}
}
