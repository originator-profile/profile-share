<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class Example extends TestCase {
	public function test_1と2の合計は3です(): void {
		$sum = 1 + 2;
		$this->assertSame( $sum, 3 );
	}
}
