import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";

actor {
  type Suggestion = {
    name : Text;
    email : Text;
    message : Text;
  };

  var nextId = 0;
  let suggestions = Map.empty<Nat, Suggestion>();

  public shared ({ caller }) func addSuggestion(name : Text, email : Text, message : Text) : async Nat {
    let id = nextId;
    let suggestion : Suggestion = {
      name;
      email;
      message;
    };
    suggestions.add(id, suggestion);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getSuggestion(id : Nat) : async Suggestion {
    switch (suggestions.get(id)) {
      case (null) { Runtime.trap("Suggestion does not exist") };
      case (?suggestion) { suggestion };
    };
  };

  public query ({ caller }) func getAllSuggestions() : async [(Nat, Suggestion)] {
    suggestions.entries().toArray();
  };

  public shared ({ caller }) func updateSuggestion(id : Nat, name : Text, email : Text, message : Text) : async () {
    if (not suggestions.containsKey(id)) {
      Runtime.trap("Suggestion does not exist");
    };
    let updatedSuggestion : Suggestion = {
      name;
      email;
      message;
    };
    suggestions.add(id, updatedSuggestion);
  };

  public shared ({ caller }) func deleteSuggestion(id : Nat) : async () {
    if (not suggestions.containsKey(id)) {
      Runtime.trap("Suggestion does not exist");
    };
    suggestions.remove(id);
  };
};
