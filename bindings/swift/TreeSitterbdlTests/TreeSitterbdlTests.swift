import XCTest
import SwiftTreeSitter
import TreeSitterBdl

final class TreeSitterBdlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_bdl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading bdl grammar")
    }
}
