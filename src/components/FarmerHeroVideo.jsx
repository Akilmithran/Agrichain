import React from 'react';
import { Sprout, Sparkles, Leaf } from 'lucide-react';

export default function FarmerHeroVideo({
  onOpenDeclareModal,
  onScrollToMatches
}) {
  return (
    <div 
      className="glass-panel"
      style={{
        position: 'relative',
        width: '100%',
        background: 'linear-gradient(135deg, #163020 0%, #1F2D1F 50%, #121614 100%)',
        border: '1px solid rgba(118, 185, 71, 0.35)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        padding: '36px 32px',
        marginBottom: '28px',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Agriculture SVG Background Elements */}
      <div 
        style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          bottom: '-20px',
          width: '380px',
          opacity: 0.06,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Sprout size={320} color="#76B947" />
      </div>

      <div 
        style={{
          position: 'absolute',
          right: '280px',
          bottom: '-30px',
          opacity: 0.04,
          pointerEvents: 'none'
        }}
      >
        <Leaf size={180} color="#5E9F5B" />
      </div>

      {/* Main Content (Full Width Single Card) */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
        {/* Top Left Live Farm Activity Badge */}
        <div style={{ marginBottom: '18px', display: 'inline-flex' }}>
          <div 
            style={{
              background: 'rgba(22, 48, 32, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(118, 185, 71, 0.45)',
              color: '#76B947',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.08em',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#76B947',
                display: 'inline-block',
                boxShadow: '0 0 10px #76B947'
              }}
            />
            <span>● LIVE FARM ACTIVITY</span>
          </div>
        </div>

        {/* Brand Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌾</span>
          <span style={{
            fontSize: '13px',
            fontWeight: '800',
            letterSpacing: '0.12em',
            color: '#76B947',
            textTransform: 'uppercase'
          }}>
            AGRICHAIN DIRECT
          </span>
        </div>

        {/* Main Title */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#F7F5EF',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          marginBottom: '10px'
        }}>
          From Farm Planning to Reliable Buyers
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: '#B8BDB5',
          lineHeight: '1.5',
          marginBottom: '26px'
        }}>
          AI-powered pre-harvest matching for farmers and FPOs
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={onOpenDeclareModal}
            style={{
              background: 'linear-gradient(135deg, #3F7D4A, #5E9F5B)',
              border: '1px solid rgba(118, 185, 71, 0.35)',
              boxShadow: '0 4px 16px rgba(63, 125, 74, 0.4)',
              fontWeight: '700',
              color: '#F7F5EF'
            }}
          >
            <Sprout size={18} />
            <span>Declare Planned Crop</span>
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={onScrollToMatches}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#F7F5EF',
              fontWeight: '600'
            }}
          >
            <Sparkles size={18} style={{ color: '#76B947' }} />
            <span>View Buyer Matches</span>
          </button>
        </div>
      </div>
    </div>
  );
}
