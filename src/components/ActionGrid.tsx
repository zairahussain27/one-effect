import React from 'react';
import ActionCard from './ActionCard';
import { ACTIONS } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import { go } from '../utils/calculator';

interface ActionGridProps {
  selected?: string;
  onSelect?: (id: string) => void;
}

export default function ActionGrid(props: ActionGridProps) {
  const { selectedActionId, setSelectedActionId, selectedAction } = useImpact();
  const currentSelected = props.selected !== undefined ? props.selected : selectedActionId;
  const handleSelect = props.onSelect || setSelectedActionId;

  const onCardSelect = (id: string) => {
    handleSelect(id);
    setTimeout(() => {
      go('impact');
    }, 200);
  };

  return (
    <section id="actions" className="section wrap">
      <p className="label">INDIVIDUAL ACTIONS / 00</p>
      <h2>Start with one small thing.</h2>
      <p className="lead">
        Choose an action below or upload a photo of an item you encounter daily.
      </p>
      <div className="grid5">
        {ACTIONS.map((a) => (
          <ActionCard
            key={a.id}
            action={a}
            selected={a.id === currentSelected}
            onSelect={() => onCardSelect(a.id)}
          />
        ))}
      </div>

      <div className="row" style={{ marginTop: 24, alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => go('impact')}
        >
          See Impact for {selectedAction.name} →
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => go('scan')}
        >
          📷 Scan a photo instead
        </button>
      </div>
    </section>
  );
}
