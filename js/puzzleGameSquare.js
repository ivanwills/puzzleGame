
function puzzleGameSquares(){

	var bridgePatterns = [
			{ "bridgeCount": "0", "key":  "", "bridges": "0000", "mirrorable": false },
			{ "bridgeCount": "1", "key":  "", "bridges": "0001", "mirrorable": false },
			{ "bridgeCount": "2", "key": "a", "bridges": "0011", "mirrorable": false },
			{ "bridgeCount": "2", "key": "b", "bridges": "0101", "mirrorable": false },
			{ "bridgeCount": "3", "key":  "", "bridges": "0111", "mirrorable": false },
			{ "bridgeCount": "4", "key":  "", "bridges": "1111", "mirrorable": false }
		],
		mirrorH = [[1,3]],
		mirrorV =  [[0,2]],
		faceCount = 4,
		shape = 'square';



	private function generatePuzzle() {
		$puzzleArea = array();
		$edgeObservers = array();
		$nullObservers = array();

		// ================================================
		// add the corners

		$edges = array( true , false , false , true );
		$x = $this->X - 1;
		$y = $this->Y - 1;
		$corners = array( '0,0' , "$x,0" , "$x,$y" , "0,$y" );
		for( $a = 0 ; $a < 4 ; $a += 1 ) {
			$tmp = explode(',',$corners[$a]);
			if( !isset($puzzleArea[$tmp[0]]) ) {
				$puzzleArea[$tmp[1]] = array();
			}
			$tmpObserver = $this->createObserver( $edges );
			$this->pieces[$tmp[1]][$tmp[0]] = $tmpObserver;
			$this->edgeObservers[] = $tmpObserver;
			$this->nullObserver[] = $tmpObserver;
			$edges = $this->rotate($edges);
		}

		// ================================================
		// add the sides

		$edges = array( true , false , false , false );
		$edges = $this->rotate($edges);

		for( $a = 1 ; $a < $y ; $a += 1 ) {
			if( !isset($puzzleArea[$a]) ) {
				$puzzleArea[$a] = array();
			}
			$tmpObserver = $this->createObserver( $edges );
			$this->pieces[$a][$x] = $tmpObserver;
			$this->edgeObservers[] = $tmpObserver;
			$this->nullObserver[] = $tmpObserver;
			$edges = $this->rotate($edges,2);

			$tmpObserver = $this->createObserver( $edges );
			$this->pieces[$a][0] = $tmpObserver;
			$this->edgeObservers[] = $tmpObserver;
			$this->nullObserver[] = $tmpObserver;
			$edges = $this->rotate($edges,2);
		}
		$edges = $this->rotate($edges);
		for( $a = 1 ; $a < $x ; $a += 1 ) {
			$tmpObserver = $this->createObserver( $edges );
			$this->pieces[0][$a] = $tmpObserver;
			$this->edgeObservers[] = $tmpObserver;
			$this->nullObserver[] = $tmpObserver;
			$edges = $this->rotate($edges,2);

			$tmpObserver = $this->createObserver( $edges );
			$this->pieces[$y][$a] = $tmpObserver;
			$this->edgeObservers[] = $tmpObserver;
			$this->nullObserver[] = $tmpObserver;
			$edges = $this->rotate($edges,2);
		}

		// ================================================
		// add the middle

		$edges = array( false , false , false , false );
		for( $a = 1 ; $a < $y ; $a += 1 ) {
			for( $b = 1 ; $b < $x ; $b += 1 ) {
				$tmpObserver = $this->createObserver( $edges );
				$this->pieces[$a][$b] = $tmpObserver;
				$this->nullObserver[] = $tmpObserver;
			}
		}

		// ================================================
		// set neighbours

		for( $y = 0 ; $y < $this->Y ; $y += 1 ) {
			for( $x = 0 ; $x < $this->X ; $x += 1 ) {
				$observer = $this->pieces[$y][$x];
				$north = $y - 1;
				$east = $x + 1;
				$south = $y + 1;
				$west = $x - 1;
				if( isset($puzzleArea[$north][$x]) ) {
					$observer->setNeighbourObserver($this->pieces[$north][$x],0);
				}
				if( isset($puzzleArea[$east][$y]) ) {
					$observer->setNeighbourObserver($this->pieces[$east][$y],1);
				}
				if( isset($puzzleArea[$south][$x]) ) {
					$observer->setNeighbourObserver($this->pieces[$south][$x],2);
				}
				if( isset($puzzleArea[$west][$y]) ) {
					$observer->setNeighbourObserver($this->pieces[$west][$y],3);
				}
				$observer->setXY($x,$y);
			}
		}
	}

	protected function applySymetricalModeInner( $x , $y , $observer , $xy ) {
		if( $$xy !== false ) {
			$piece = $observer->getPieceClone();
			$func = "mirror$xy";
			$piece->$func();
			$this->pieces[$y][$x]->setPuzzlePiece($piece);
			$this->removeWaitingObserver("$x,$y");
			return $this->pieces[$y][$x];
		}
		return false;
	}

	protected function applyHorizontallySymmetricalMode( puzzlePieceObserver $observer ) {
		$x = $this->getMirror($observer->getX(),'X');
		$y = $observer->getY();
		return applySymetricalModeInner( $x , $y , $observer , 'x' );
	}

	protected function applyVerticallySymmetricalMode( puzzlePieceObserver $observer ) {
		$x = $observer->getX();
		$y = $this->getMirror($observer->getY(),'Y');
		return applySymetricalModeInner( $x , $y , $observer , 'y' );
	}

	protected function applyHorizontallyVerticallySymmetricalMode( puzzlePieceObserver $observer ) {
		if( $newObserver = $this->applyVerticallySymmetricalMode($observer) ) {
			$this->applyHorizontallySymmetricalMode($newObserver);
		}
		$this->applyHorizontallySymmetricalMode($observer);
	}

	protected function applyDiagonallySymmetricalMode( puzzlePieceObserver $observer ) {
		$x = $this->getMirror($observer->getX(),'X');
		$y = $this->getMirror($observer->getY(),'Y');
		if( $x !== false && $y !== false ) {
			$piece = $observer->getPieceClone();
			$piece->rotate180();
			$this->pieces[$y][$x]->setPuzzlePiece($piece);
			$this->removeWaitingObserver("$x,$y");
			return $this->pieces[$y][$x];
		}

	}
	protected function applyRadiallySymmetricalMode( puzzlePieceObserver $observer ) { /* Not yet implemented }
}

