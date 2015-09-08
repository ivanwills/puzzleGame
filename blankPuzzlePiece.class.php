<?php

require_once(dirname(__FILE__).'/puzzleGame.interface.php');

class blankPuzzlePiece implements puzzlePieceInterface
{
	protected $bridges = array();

	protected $faceCount = 3;

	protected $shape = '';
	protected $code = '0';

	static private $singleton = array();

	private function __construct( $shape , $faces ) {
		if( $shape = self::shapeIsValid($shape) ) {
			$this->shape = $shape;
		}
		if( $faces !== self::facesIsValid($faces) ) {
			$this->faceCount = $faces;
		}
		for( $a = 0 ; $a < $this->faceCount ; $a += 1 ) {
			$this->bridges[] = false;
		}
	}


	static public function getBlankPiece( $shape , $faces ) {
		if( $shape = self::shapeIsValid($shape) ) {
			if( !isset(self::$singleton[$shape]) ) {
				if( $faces = self::facesIsValid($faces) ) {
					self::$singleton[$shape] = new blankPuzzlePiece($shape , $faces );
				} else {
					if( !is_int($faces) ) {
						$suffix = gettype($faces);
					} else {
						$suffix = $faces;
					}
					throw new exception('blankPuzzlePiece::getBlankPiece() expects second parameter $faces to be an integer greater than 2. '.$suffix.' given');
				}
			}
			return self::$singleton[$shape];
		} else {
			if( !is_string($shape)) {
				$suffix = gettype($shape);
			} else {
				$suffix = $shape;
			}
			throw new exception('blankPuzzlePiece::getBlankPiece() expects first parameter $shape to be a a valid shape name. '.$suffix.' given');
		}
	}


	public function isConnected() { return true; }

	public function hasBridge( $face ) { return false; }

	public function getOrientation() { return 0; }

	public function rotate( $steps = 1 ) { return 0; }

	public function rotateBack($steps = 1 ) { return 0; }

	public function getShape() { return $this->shape; }

	public function getCode() { return $this->code; }

	public function copyMe() { return $this; }

	static public function getBridgePatterns() {
		$output = array( array( 'key' => '0' , 'bridgeCount' => 0 , 'bridges' => array() , 'mirror' => false ) );

	}

	static protected function shapeIsValid($shape) {

		if( is_string($shape) ) {
			$shape = trim(strtolower($shape));
			if( strlen($shape) > 4 && ( $shape === 'triangle' || $shape === 'square' || substr($shape,-4,4)  === 'agon' ) ) {
				return $shape;
			}
		}
		return false;
	}
	static protected function facesIsValid($faces) {
		if( is_int($faces) && $faces > 2 ) {
			return true;
		}
		return false;
	}
}

class nullPuzzlePiece extends blankPuzzlePiece  {

	static private $singleton = array();
	protected $code = 'N';

	public function hasBridge( $face ) { return null; }
	static public function getBridgePatterns() {
		$output = array( array( 'key' => 'N' , 'bridgeCount' => 0 , 'bridges' => array() , 'mirror' => false ) );

	}
}