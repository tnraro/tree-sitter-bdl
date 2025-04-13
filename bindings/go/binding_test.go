package tree_sitter_bdl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_bdl "github.com/tnraro/tree-sitter-bdl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_bdl.Language())
	if language == nil {
		t.Errorf("Error loading bdl grammar")
	}
}
