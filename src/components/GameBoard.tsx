import { Box, Grid, GridItem, useToast } from '@chakra-ui/react';
import { useGame } from '../contexts/GameContext';
import type { Position, Ship, Debris } from '../types/game';
import { useState } from 'react';

// Importe os SVGs dos detritos e naves
import asteroidSvg from '../assets/debris/asteroid.svg';
import satelliteSvg from '../assets/debris/satellite.svg';
import fighterSvg from '../assets/spaceships/fighter.svg';
import cruiserSvg from '../assets/spaceships/cruiser.svg';

interface GameBoardProps {
  onCellClick: (position: Position) => void;
  onShipSelect?: (ship: Ship) => void;
  selectedAction?: 'MOVE' | 'ATTACK' | 'DONATE' | null;
}

export const GameBoard = ({ onCellClick, onShipSelect, selectedAction }: GameBoardProps) => {
  const { currentRoom, currentPlayer } = useGame();
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const toast = useToast();

  if (!currentRoom) return null;

  const { gridSize, ships, debris } = currentRoom;

  const getShipAtPosition = (pos: Position): Ship | undefined => {
    return ships?.find(ship => ship.position.x === pos.x && ship.position.y === pos.y);
  };

  const getDebrisAtPosition = (pos: Position): Debris | undefined => {
    return debris?.find(d => d.position.x === pos.x && d.position.y === pos.y);
  };

  const handleCellClick = (position: Position) => {
    const shipAtPosition = getShipAtPosition(position);

    if (selectedAction) {
      onCellClick(position);
      return;
    }

    if (shipAtPosition) {
      if (shipAtPosition.playerId === currentPlayer?.id) {
        setSelectedShip(shipAtPosition);
      }
      onShipSelect?.(shipAtPosition);
      return;
    }

    onCellClick(position);
  };

  return (
    <Box w="100%" maxW="600px" aspectRatio="1" border="2px" borderColor="gray.200" p={2}>
      <Grid
        templateColumns={`repeat(${gridSize.width}, 1fr)`}
        templateRows={`repeat(${gridSize.height}, 1fr)`}
        gap={1}
        h="100%"
      >
        {Array.from({ length: gridSize.height }).map((_, y) =>
          Array.from({ length: gridSize.width }).map((_, x) => {
            const position = { x, y };
            const ship = getShipAtPosition(position);
            const debris = getDebrisAtPosition(position);
            const isSelected = selectedShip?.id === ship?.id;

            return (
              <GridItem
                key={`${x}-${y}`}
                bg={isSelected ? 'blue.200' : 'gray.100'}
                border="1px"
                borderColor="gray.300"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => handleCellClick(position)}
                position="relative"
                _hover={{ bg: 'gray.200' }}
              >
                {ship && (
                  <Box
                    as="img"
                    src={ship.type === 'fighter' ? fighterSvg : cruiserSvg}
                    alt={ship.type}
                    w="80%"
                    h="80%"
                    opacity={ship.actionPoints > 0 ? 1 : 0.5}
                  />
                )}
                {debris && (
                  <Box
                    as="img"
                    src={debris.type === 'asteroid' ? asteroidSvg : satelliteSvg}
                    alt={debris.type}
                    w="80%"
                    h="80%"
                    opacity={0.8}
                  />
                )}
              </GridItem>
            );
          })
        )}
      </Grid>
    </Box>
  );
};
