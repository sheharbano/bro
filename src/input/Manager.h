// See the file "COPYING" in the main distribution directory for copyright.

#ifndef INPUT_MANAGER_H
#define INPUT_MANAGER_H

#include "../BroString.h"

#include "../Val.h"
#include "../EventHandler.h"
#include "../RemoteSerializer.h"

#include <vector>

namespace input {

class ReaderFrontend;
class ReaderBackend; 

class Manager {
public:
	Manager();
    
    	ReaderFrontend* CreateStream(EnumVal* id, RecordVal* description);
	bool ForceUpdate(const EnumVal* id);
	bool RemoveStream(const EnumVal* id);	

	bool AddTableFilter(EnumVal *id, RecordVal* filter);
	bool RemoveTableFilter(EnumVal* id, const string &name);

	bool AddEventFilter(EnumVal *id, RecordVal* filter);
	bool RemoveEventFilter(EnumVal* id, const string &name);
	
protected:
	friend class ReaderFrontend;
	friend class PutMessage;
	friend class DeleteMessage;
	friend class ClearMessage;
	friend class SendEventMessage;
	friend class SendEntryMessage;
	friend class EndCurrentSendMessage;
	friend class FilterRemovedMessage;
	friend class ReaderFinishedMessage;

	// Reports an error for the given reader.
	void Error(ReaderFrontend* reader, const char* msg);

	// for readers to write to input stream in direct mode (reporting new/deleted values directly)
	void Put(const ReaderFrontend* reader, int id, threading::Value* *vals);
	void Clear(const ReaderFrontend* reader, int id);
	bool Delete(const ReaderFrontend* reader, int id, threading::Value* *vals);

	// for readers to write to input stream in indirect mode (manager is monitoring new/deleted values)
	void SendEntry(const ReaderFrontend* reader, const int id, threading::Value* *vals);
	void EndCurrentSend(const ReaderFrontend* reader, const int id);
	
	bool SendEvent(const string& name, const int num_vals, threading::Value* *vals);

	ReaderBackend* CreateBackend(ReaderFrontend* frontend, bro_int_t type);	
	
	bool RemoveFilterContinuation(const ReaderFrontend* reader, const int filterId);
	bool RemoveStreamContinuation(const ReaderFrontend* reader);
	
private:
	struct ReaderInfo;

	int SendEntryTable(const ReaderFrontend* reader, int id, const threading::Value* const *vals);	
	int PutTable(const ReaderFrontend* reader, int id, const threading::Value* const *vals);	
	int SendEventFilterEvent(const ReaderFrontend* reader, EnumVal* type, int id, const threading::Value* const *vals);

	bool IsCompatibleType(BroType* t, bool atomic_only=false);

	bool UnrollRecordType(vector<threading::Field*> *fields, const RecordType *rec, const string& nameprepend);

	void SendEvent(EventHandlerPtr ev, const int numvals, ...);	
	void SendEvent(EventHandlerPtr ev, list<Val*> events);	

	HashKey* HashValues(const int num_elements, const threading::Value* const *vals);
	int GetValueLength(const threading::Value* val);
	int CopyValue(char *data, const int startpos, const threading::Value* val);

	Val* ValueToVal(const threading::Value* val, BroType* request_type);
	Val* ValueToIndexVal(int num_fields, const RecordType* type, const threading::Value* const *vals);
	RecordVal* ValueToRecordVal(const threading::Value* const *vals, RecordType *request_type, int* position);	
	RecordVal* ListValToRecordVal(ListVal* list, RecordType *request_type, int* position);

	ReaderInfo* FindReader(const ReaderFrontend* reader);
	ReaderInfo* FindReader(const EnumVal* id);

	vector<ReaderInfo*> readers;

	string Hash(const string &input);	

	class Filter;
	class TableFilter;
	class EventFilter;

	enum FilterType { TABLE_FILTER, EVENT_FILTER };
};


}

extern input::Manager* input_mgr;


#endif /* INPUT_MANAGER_H */